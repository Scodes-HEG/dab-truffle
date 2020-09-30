import Web3 from 'web3'
import TABLE_COMPILED from '~/build/contracts/Requerants';
import { ETHERSCAN_URL } from '~/services/ethereum';
import { IPFS_MANAGER } from '~/services/ipfs';
import { Notifier } from '~/services/notifier.js';
import {WEB3_BUS} from '~/services/web3';

export const state = () => ({
  contract: {
    instance: null,
    network: null,
    address: null,
    url: null,
  },
  creator: {
    address: null,
    url: null
  },
  updator: {
    address: null,
    url: null
  },
  hash: null,
  data: {
    remote: {},
  },
  read: false,
  listen: {
    hash: false
  }
});

export const getters = {
  getContract: state => state.contract,
  getRead: state => state.read,
  getHash: state => state.hash,
  getRemote: state => state.data ? null : state.remote
};

export const mutations = {
  async registerContractInstance (state, payload) {
    state.contract.instance = () => payload
  },
  registerContractNetwork (state, payload) {
    state.contract.network = payload
  },
  registerContractAddress (state, payload) {
    state.contract.address = payload
    state.contract.url = ETHERSCAN_URL(state.contract.network, '/address/'+state.contract.address)
  },
  registerCreator (state, payload) {
    state.creator.address = payload
    state.creator.url = ETHERSCAN_URL(state.contract.network, '/address/'+payload)
  },
  registerUpdator (state, payload) {
    state.updator.address = payload
    state.updator.url = ETHERSCAN_URL(state.contract.network, '/address/'+payload)
  },
  registerHash (state, payload) {
    state.hash = payload
  },
  registerRemoteData (state, payload) {
    state.data.remote = payload
  },
  registerRead (state, payload) {
    state.read = payload
  },
  registerListenHash (state, payload) {
    state.listen.hash = payload
  },
};

export const actions = {
  async getContractInstance ({rootState, state, commit, dispatch}) {
    let oracleContractInstance = await rootState.oracle.contract.instance();
    let address = await oracleContractInstance.methods.read(TABLE_COMPILED.contractName).call();

    let getContract = new Promise(function (resolve, reject) {
      let addressToCall = state.contract.address;
      if (!addressToCall) {
        addressToCall = address;
      }

      let web3 = new Web3(window.web3.currentProvider);
      let contractInstance = new web3.eth.Contract(TABLE_COMPILED.abi, addressToCall);
      resolve(contractInstance)
    });

    try {
      let contract = await getContract;
      let address = await contract._address;
      commit('registerContractNetwork', rootState.web3.networkId);
      commit('registerContractAddress', address);
      commit('registerContractInstance', contract);
      dispatch('listen');
    } catch(e) {
      dispatch('listen');
    }

  },
  listen(context) {
    if (!context.state.listen.hash) {
      context.commit('registerListenHash', true);
      context.state.contract.instance().events.hashUpdated().on('data', function(event) {
        WEB3_BUS.$emit('hashUpdated');
        Notifier.info('Une nouvelle liste des requérants a été accepté', event);
        this.dispatch('readContract')
      }.bind(context));
    }
  },
  async readContract ({state, commit, dispatch}) {
    let instance = await state.contract.instance();

    commit('registerCreator', await instance.methods.created_by().call());

    let hash = await instance.methods.currentHash().call();
    commit('registerHash', hash);

    if (hash) {
      Notifier.log('shared_table STORE: reading hash ', hash);
      let ipfs = await IPFS_MANAGER.read(hash);
      ipfs = JSON.parse(ipfs);
      if (ipfs.data) {
        commit('registerRemoteData', ipfs.data);
      } else {
        commit('registerRemoteData', null);
      }
      commit('registerRead', true);
    } else {
      commit('registerRead', true);
    }
    WEB3_BUS.$emit('updated');
  }
}
