import Web3 from 'web3'
import ORACLE_COMPILED from '~/build/contracts/Oracle'
import { ETHERSCAN_URL } from '~/services/ethereum';
import { Notifier } from '~/services/notifier.js';
import {WEB3_BUS} from '~/services/web3';

export const state = () => ({
  contract: {
    instance: null,
    network: null,
    address: null,
    url: null,
    listen: {
      changes: false
    }
  }
});

export const getters = {
  getContract: state => state.contract,
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
  registerListenChanges (state, payload) {
    if (!state.listen) {
      state.listen = {};
    }
    state.listen.changes = payload
  },
};

export const actions = {
  async getContractInstance (context) {
    let web3Instance = await context.rootGetters['web3/getInstance'];
    let contractAddress = ORACLE_COMPILED.networks[web3Instance.networkId].address;

    let getContract = new Promise(function (resolve, reject) {
      let web3 = new Web3(window.web3.currentProvider);
      let sharedTableContractInstance = new web3.eth.Contract(ORACLE_COMPILED.abi, contractAddress);
      resolve(sharedTableContractInstance)
    });

    try {
      let contract = await getContract;
      let address = await contract._address;
      context.commit('registerContractNetwork', web3Instance.networkId);
      context.commit('registerContractAddress', address);
      context.commit('registerContractInstance', contract);
      context.dispatch('listen');
    } catch(e) {
      context.dispatch('listen');
      // console.error(e);
    }
  },
  listen(context) {
    if (!context.state.listen || !context.state.listen.changes) {
      context.commit('registerListenChanges', true);
      context.state.contract.instance().events.writeRegister().on('data', function(event) {
        setTimeout(function() {
          WEB3_BUS.$emit('init');
        }.bind(this), 5000);
      }.bind(context));
    }
  }
}
