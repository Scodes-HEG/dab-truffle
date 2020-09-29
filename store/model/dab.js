import Web3 from 'web3'
import TABLE from '~/services/constants/dab'
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
    remote: null,
    local: null
  },
  proposalIds: [],
  read: false,
  listen: {
    hash: false,
    proposals: false
  }
});

export const getters = {
  getContract: state => state.contract,
  getRead: state => state.read,
  getHash: state => state.hash,
  getRemote: state => state.data ? null : state.remote,
  getLocal: state => state.data ? null : state.local,
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
  initLocalData(state) {
    state.data.local = null;
  },
  registerLocalData (state, payload) {
    state.data.local = payload
  },
  registerProposalIds (state, payload) {
    state.proposalIds = payload
  },
  registerListenHash (state, payload) {
    state.listen.hash = payload
  },
  registerListenProposals (state, payload) {
    state.listen.proposals = payload
  },
};

export const actions = {
  setLocalData({commit}, data) {
    localStorage.setItem('dab', JSON.stringify(data));
    commit('registerLocalData', data);
  },
  async getContractInstance ({rootState, state, commit, dispatch}) {
    let oracleContractInstance = await rootState.oracle.contract.instance();
    let address = await oracleContractInstance.methods.read(TABLE.identifier).call();

    let getContract = new Promise(function (resolve, reject) {
      let addressToCall = state.contract.address;
      if (!addressToCall) {
        addressToCall = address;
      }

      let web3 = new Web3(window.web3.currentProvider);
      let contractInstance = new web3.eth.Contract(TABLE.abi, addressToCall);
      resolve(contractInstance)
    });

    try {
      let contract = await getContract;
      let address = await contract._address;
      commit('registerContractNetwork', TABLE.network);
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
        Notifier.info('Une nouvelle version du tableau a été acceptée', event);
        this.dispatch('readContract')
      }.bind(context));
    }
    if (!context.state.listen.proposals) {
      context.commit('registerListenProposals', true);
      context.state.contract.instance().events.newProposal().on('data', function(event) {
        WEB3_BUS.$emit('newProposal');
        Notifier.info('Une nouvelle proposition a été faite', event);
        this.dispatch('readProposals')
      }.bind(context));
    }
  },
  async readContract ({state, commit, dispatch}) {
    dispatch('readProposals');

    let data = JSON.parse(localStorage.getItem('dab'));
    if (data) {
      commit('registerLocalData', data);
    }

    let instance = await state.contract.instance();

    commit('registerCreator', await instance.methods.created_by().call());

    let hash = await instance.methods.currentHash().call();
    commit('registerHash', hash);

    if (hash) {
      Notifier.log('shared_table STORE: reading hash ', hash);
      let ipfs = await IPFS_MANAGER.read(hash);
      ipfs = JSON.parse(ipfs);
      commit('registerRemoteData', ipfs.data);
      commit('registerRead', true);

      if (!state.data.local) {
        dispatch('pull');
      }
    } else {
      commit('registerRead', true);
    }
  },
  async readProposals ({state, commit, dispatch}) {
    let instance = await state.contract.instance();
    let proposals = [];
    let numberOfProposals = await instance.methods.numberOfProposals().call();
    for (let i = 0; i < numberOfProposals; i++) {
      proposals[i] = await instance.methods.proposalIds(i).call();
    }
    commit('registerProposalIds', proposals);
  },
  async pull ({state, commit}) {
    let local = null;
    if (state.data.remote) {
      local = JSON.parse(JSON.stringify(state.data.remote));
    }
    commit('registerLocalData', local);
  }
}
