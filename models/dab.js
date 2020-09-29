import { v4 as uuid } from 'uuid';
import md5 from 'md5';
import { IPFS_MANAGER } from '~/services/ipfs';
import { Notifier } from '~/services/notifier.js';
import { ETHERSCAN_URL } from '~/services/ethereum';
import {LOADER_TURN_ON, LOADER_TURN_OFF} from '~/services/loader.js';
import {WEB3_BUS} from '~/services/web3';

let model = {
  parcelles: [],
  pools: [],
  parcelle_pool_dabs: {},
  md5_total: null,
  md5_parcelles: null,
  md5_pools: null,
  md5_dabs: null,
};

let waitingForConfirmation = false;
let lastAddedProposalTransaction = null;
let lastAddedProposalTransactionUrl = null;

export default (context) => () => ({
  async pullRemote() {
    let remote = this._getRemote();
    this._saveLocal(remote);

    return remote;
  },
  async pullRemoteParcelles() {
    let remote = this._getRemote();
    let local = this._getLocal();
    local.parcelles = this._jsonCopy(remote.parcelles);
    local.md5_parcelles = this._computeMD5(local.parcelles);
    this._saveLocal(local);

    return local.parcelles;
  },
  async pullRemotePools() {
    let remote = this._getRemote();
    let local = this._getLocal();
    local.pools = this._jsonCopy(remote.pools);
    local.md5_pools = this._computeMD5(local.pools);
    this._saveLocal(local);

    return local.pools;
  },
  async copyProposal(proposalHash) {
    let model = await IPFS_MANAGER.read(proposalHash);
    model = JSON.parse(model);
    this._saveLocal(model.data);
    let local = this._getLocal();

    return local;
  },
  async acceptProposal(proposalHash) {
    let contractInstance = context.store.state.model.dab.contract.instance;
    contractInstance().methods.acceptProposal(proposalHash).send({
      from: context.store.state.web3.coinbase
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      waitingForConfirmation = true;
      lastAddedProposalTransaction = hash;
      lastAddedProposalTransactionUrl = ETHERSCAN_URL(context.store.state.model.dab.contract.network, '/tx/'+hash);
      WEB3_BUS.$on('hashUpdated', () => {
        if (waitingForConfirmation) {
          LOADER_TURN_OFF();
          WEB3_BUS.$emit('proposal-accepted');
          Notifier.info("La proposition a été accepté, nous envoyons l'information à tout le monde");
          waitingForConfirmation = false;
        }
      });
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de l'acceptation de votre proposition' !", err);
    });

  },
  async proposeLocal() {
    let commit = {};
    commit.data = this._getLocal();
    commit.previousVersion = context.store.state.model.dab.hash;

    let newIpfsHash = await IPFS_MANAGER.add(JSON.stringify(commit));
    newIpfsHash = newIpfsHash.hash;

    let contractInstance = context.store.state.model.dab.contract.instance;
    contractInstance().methods.addProposal(newIpfsHash).send({
      from: context.store.state.web3.coinbase
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      waitingForConfirmation = true;
      lastAddedProposalTransaction = hash;
      lastAddedProposalTransactionUrl = ETHERSCAN_URL(context.store.state.model.dab.contract.network, '/tx/'+hash);
      WEB3_BUS.$on('newProposal', () => {
        if (waitingForConfirmation) {
          WEB3_BUS.$emit('proposal-created');
          LOADER_TURN_OFF();
          Notifier.info("Votre proposition a été envoyé, nous envoyons l'information à tout le monde");
          waitingForConfirmation = false;
        }
      });
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de la création de votre proposition !", err);
    });

  },
  isDiff() {
    return context.store.state.model.dab.data.remote.md5_dabs != this._getLocal().md5_dabs;
  },
  isDiffParcelles() {
    return context.store.state.model.dab.data.remote.md5_parcelles != this._getLocal().md5_parcelles;
  },
  isDiffPools() {
    return context.store.state.model.dab.data.remote.md5_pools != this._getLocal().md5_pools;
  },
  getLocalParcelles() {
    let local = this._getLocal();
    return this._jsonCopy(local.parcelles);
  },
  getLocalPools() {
    let local = this._getLocal();
    return this._jsonCopy(local.pools);
  },
  getLocalDabs() {
    let local = this._getLocal();
    return this._jsonCopy(local.parcelle_pool_dabs);
  },
  getLocalParcellePoolDABs(parcelleUuid, poolUuid) {
    let localParcellePoolDABs = 0;
    let local = this._getLocal();
    if (local.parcelle_pool_dabs && (local.parcelle_pool_dabs != {})) {
      if (local.parcelle_pool_dabs[parcelleUuid]) {
        if (local.parcelle_pool_dabs[parcelleUuid][poolUuid]) {
          localParcellePoolDABs = Number(local.parcelle_pool_dabs[parcelleUuid][poolUuid]);
        }
      }
    }

    return localParcellePoolDABs;
  },
  getRemoteParcellePoolDABs(parcelleUuid, poolUuid) {
    let remoteParcellePoolDABs = 0;
    let remote = this._getRemote();
    if (remote.parcelle_pool_dabs && (remote.parcelle_pool_dabs != {})) {
      if (remote.parcelle_pool_dabs[parcelleUuid]) {
        if (remote.parcelle_pool_dabs[parcelleUuid][poolUuid]) {
          remoteParcellePoolDABs = Number(remote.parcelle_pool_dabs[parcelleUuid][poolUuid]);
        }
      }
    }

    return remoteParcellePoolDABs;
  },
  getRemoteDABArray() {
    let remote = this._getRemote();
    let parcelles = remote.parcelles;
    let pools = remote.pools;
    let dabArray = [];

     for (let i = 0; i < parcelles.length; i++) {
      let parcelle = parcelles[i];
      for (let j = 0; j < pools.length; j++) {
        let key = i+'-'+j;
        let pool = pools[j];
        let dab = this.getRemoteParcellePoolDABs(parcelle.uuid, pool.uuid);
        if (dab && (dab > 0)) {
          dabArray.push({
            parcelle,
            pool,
            dab,
            key
          });
        }
      }
    }

    return dabArray;
  },
  getLocalParcelleDABs(parcelleUuid) {
    let localParcellePoolDABs = 0;
    let local = this._getLocal();
    if (local.parcelle_pool_dabs && (local.parcelle_pool_dabs != {})) {
      if (local.parcelle_pool_dabs[parcelleUuid]) {
        for(let poolUuid in local.parcelle_pool_dabs[parcelleUuid]) {
          localParcellePoolDABs += Number(local.parcelle_pool_dabs[parcelleUuid][poolUuid]);
        };
      }
    }

    return localParcellePoolDABs;
  },
  getLocalPoolDABs(poolUuid) {
    let localTotalDAB = 0;
    let local = this._getLocal();
    if (local.parcelle_pool_dabs && (local.parcelle_pool_dabs != {})) {
      for(let parcelleUuid in local.parcelle_pool_dabs) {
        if (local.parcelle_pool_dabs[parcelleUuid][poolUuid]) {
          localTotalDAB += Number(local.parcelle_pool_dabs[parcelleUuid][poolUuid]);
        }
      };
    }

    return localTotalDAB;
  },
  getLocalDABs() {
    let localTotalDAB = 0;
    let local = this._getLocal();
    if (local.parcelle_pool_dabs && (local.parcelle_pool_dabs != {})) {
      for(let parcelleUuid in local.parcelle_pool_dabs) {
        for(let poolUuid in local.parcelle_pool_dabs[parcelleUuid]) {
          localTotalDAB += Number(local.parcelle_pool_dabs[parcelleUuid][poolUuid]);
        };
      };
    }

    return localTotalDAB;
  },
  getLocalSurfaceTotal() {
    let localSurfaceTotal = 0;
    let parcelles = this.getLocalParcelles();
    parcelles.forEach((parcelle) => {
      localSurfaceTotal += Number(parcelle.surface);
    });

    return localSurfaceTotal;
  },
  hasProposals() {
    return !!context.store.state.model.dab.proposalIds.length;
  },
  proposalIds() {
    return context.store.state.model.dab.proposalIds;
  },
  saveLocalParcelles(parcelles) {
    let local = this._getLocal();
    local.parcelles = this._jsonCopy(parcelles);
    local.md5_parcelles = this._computeMD5(local.parcelles);
    this._saveLocal(local);
  },
  saveLocalPools(pools) {
    let local = this._getLocal();
    local.pools = this._jsonCopy(pools);
    local.md5_pools = this._computeMD5(local.pools);
    this._saveLocal(local);
  },
  saveLocalParcellePoolDABs(parcelleUuid, poolUuid, value) {
    let local = this._getLocal();
    if (!local.parcelle_pool_dabs[parcelleUuid]) {
      local.parcelle_pool_dabs[parcelleUuid] = {};
    }
    local.parcelle_pool_dabs[parcelleUuid][poolUuid] = value;
    if (!value || (value == "0")) {
      delete local.parcelle_pool_dabs[parcelleUuid][poolUuid];
      if (JSON.stringify(local.parcelle_pool_dabs[parcelleUuid]) == "{}") {
        delete local.parcelle_pool_dabs[parcelleUuid];
      }
    }

    local.md5_dabs = this._computeMD5(local.parcelle_pool_dabs);
    this._saveLocal(local);
  },
  addNewLocalParcelle() {
    let parcelles = this.getLocalParcelles();
    parcelles.push({
      uuid: uuid(),
      id: null,
      surface: null
    });
    this.saveLocalParcelles(parcelles);
  },
  addNewLocalPool() {
    let pools = this.getLocalPools();
    pools.push({
      uuid: uuid(),
      pool: null
    });
    this.saveLocalPools(pools);
  },
  removePool(poolUuid) {
    let pools = this.getLocalPools();
    let index = -1;
    for(var i = 0; i < pools.length; i++) {
      if(pools[i].uuid == poolUuid) {
        index = i;
      }
    }
    if (index > -1) {
      pools.splice(index, 1)
    }
    this.saveLocalPools(pools);

    let dabs = this.getLocalDabs();
    for(let parcelleUuid in dabs) {
      for(let currentPoolUuid in dabs[parcelleUuid]) {
        if (currentPoolUuid == poolUuid) {
          delete dabs[parcelleUuid][currentPoolUuid];
        }
      }
    }

    let local = this._getLocal();

    local.parcelle_pool_dabs = dabs;
    local.md5_dabs = this._computeMD5(dabs);
    this._saveLocal(local);
  },
  removeParcelle(parcelleUuid) {
    let parcelles = this.getLocalParcelles();
    let index = -1;
    for(var i = 0; i < parcelles.length; i++) {
      if(parcelles[i].uuid == parcelleUuid) {
        index = i;
      }
    }
    if (index > -1) {
      parcelles.splice(index, 1)
    }
    this.saveLocalParcelles(parcelles);

    let dabs = this.getLocalDabs();
    if (dabs[parcelleUuid]) {
      delete dabs[parcelleUuid];
    }

    let local = this._getLocal();
    local.parcelle_pool_dabs = dabs;
    local.md5_dabs = this._computeMD5(dabs);
    this._saveLocal(local);
  },
  _computeMD5(data) {
    return md5(JSON.stringify(data));
  },
  _jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  },
  _getLocal() {
    let local = this._jsonCopy(context.store.state.model.dab.data.local);
    if (!local) {
      local = model;
    }
    for(let key in model) {
      if (!local[key]) {
        local[key] = model[key];
      }
    }
    return local;
  },
  _getRemote() {
    let remote = this._jsonCopy(context.store.state.model.dab.data.remote);
    if (!remote) {
      remote = model;
    }
    for(let key in model) {
      if (!remote[key]) {
        remote[key] = model[key];
      }
    }
    return remote;
  },
  _saveLocal(local) {
    context.store.dispatch('model/dab/setLocalData', this._jsonCopy(local));
  }
});
