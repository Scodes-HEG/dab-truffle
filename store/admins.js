import Web3 from 'web3'
import TABLE_COMPILED from '~/build/contracts/Admins';
import { ETHERSCAN_URL } from '~/services/ethereum';
import {WEB3_BUS} from '~/services/web3';
import { IPFS_MANAGER } from '~/services/ipfs';

export const state = () => ({
  contract: {
    instance: null,
    network: null,
    address: null,
    url: null
  },
  requests: {
    hash: null,
    read: false,
    data: {},
    dataIsEmpty: true,
    listened: false
  },
});

export const getters = {
  getContract: state => state.contract
};

export const mutations = {
  async registerContract (state, payload) {
    state.contract.network  = payload.network;
    state.contract.address  = payload.address;
    state.contract.url      = ETHERSCAN_URL(state.contract.network, '/address/'+state.contract.address)
    state.contract.instance = () => payload.contract;
  },
  registerHash (state, payload) {
    state.requests.hash = payload;
  },
  registerRemoteData (state, payload = {}) {
    state.requests.read   = true;
    state.requests.dataIsEmpty = (JSON.stringify(payload) == "{}");
    state.requests.data = payload;
  },
  registerRequestsListened (state, payload) {
    state.requests.listened = payload;
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
      commit('registerContract', {
        network: rootState.web3.networkId,
        address: address,
        contract: contract,
      });
    } catch(e) {
      dispatch('readRemote');
      dispatch('listen');
    }
  },
  async readRemote ({state, commit}) {
    let instance = await state.contract.instance();
    let hash = await instance.methods.requestHash().call();
    commit('registerHash', hash);

    if (hash) {
      let ipfs = await IPFS_MANAGER.read(hash);
      commit('registerRemoteData', JSON.parse(ipfs));
    }
    WEB3_BUS.$emit('updated');
  },
  async listen (context) {
    if (!context.state.requests.listened) {
      context.commit('registerRequestsListened', true);
      context.state.contract.instance().events.hashUpdated().on('data', function(event) {
        WEB3_BUS.$emit('admin-requests-updated');
        this.dispatch('readRemote')
      }.bind(context));
    }
  }
}
