import Web3 from 'web3'
import TABLE from '~/services/constants/request_register'
import { ETHERSCAN_URL } from '~/services/ethereum';

export const state = () => ({
  contract: {
    instance: null,
    network: null,
    address: null,
    url: null
  }
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
};

export const actions = {
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
      commit('registerContract', {
        network: TABLE.network,
        address: address,
        contract: contract,
      });
    } catch(e) {}
  }
}
