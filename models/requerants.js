import { v4 as uuid } from 'uuid';
import md5 from 'md5';
import { IPFS_MANAGER } from '~/services/ipfs';
import { Notifier } from '~/services/notifier.js';
import { ETHERSCAN_URL } from '~/services/ethereum';
import {LOADER_TURN_ON, LOADER_TURN_OFF} from '~/services/loader.js';
import {WEB3_BUS} from '~/services/web3';

let model = {
  list: [],
};

let waitingForConfirmation = false;
let lastAddedProposalTransaction = null;
let lastAddedProposalTransactionUrl = null;

export default (context) => () => ({
  async setAccount(address, email, patronyme) {
    let remote = this._getRemote();
    let list = this._jsonCopy(remote.list);
    let account = {
      address,
      email,
      patronyme
    };
    let foundId = -1;
    for(let i = 0; i < list.length; i++) {
      if (list[i].address == address) {
        foundId = i;
      }
    }
    if (foundId != -1) {
      list[foundId] = account;
    } else {
      list.push(account);
    }

    let commit = {};
    commit.data = {
      list: list,
    };
    commit.previousVersion = context.store.state.model.requerants.hash;
    let newIpfsHash = await IPFS_MANAGER.add(JSON.stringify(commit));
    newIpfsHash = newIpfsHash.hash;
    let contractInstance = context.store.state.model.requerants.contract.instance;
    contractInstance().methods.updateHash(commit.previousVersion, newIpfsHash).send({
      from: context.store.state.web3.coinbase
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      waitingForConfirmation = true;
      lastAddedProposalTransaction = hash;
      lastAddedProposalTransactionUrl = ETHERSCAN_URL(context.store.state.model.requerants.contract.network, '/tx/'+hash);
      WEB3_BUS.$on('hashUpdated', () => {
        WEB3_BUS.$emit('new-requerant-list');
        LOADER_TURN_OFF();
        Notifier.info("Votre modification de la liste des requérants est enregistrée, nous envoyons l'information à tout le monde");
        waitingForConfirmation = false;
      });
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de la modification de la liste des requérants !", err);
    });
  },
  async getList() {
    await context.store.dispatch('model/requerants/readContract');

    return JSON.parse(JSON.stringify(context.store.state.model.requerants.data.remote.list));
  },
  getAccount(address) {
    let list = this._getRemoteList();
    for(let i = 0; i < list.length; i++) {
      if (list[i].address == address) {
        return list[i];
      }
    }

    return null;
  },
  _getRemoteList() {
    let remote = this._getRemote();
    return remote.list;
  },
  _jsonCopy(src) {
    return JSON.parse(JSON.stringify(src));
  },
  _getRemote() {
    let remote = this._jsonCopy(context.store.state.model.requerants.data.remote);
    if (!remote) {
      remote = model;
    }
    for(let key in model) {
      if (!remote[key]) {
        remote[key] = model[key];
      }
    }
    return remote;
  }
});
