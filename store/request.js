import Web3 from 'web3'
import TABLE from '~/services/constants/request'

export const state = () => ({
  contract: {
    instance: null,
  }
});

export const getters = {
  getContract: state => state.contract
};

export const mutations = {
  async registerContract (state, payload) {
    state.contract.instance = () => payload.contract;
  },
};

export const actions = {
  async getContractInstance ({rootState, state, commit, dispatch}) {
    let getContract = new Promise(async function (resolve, reject) {
      let web3 = new Web3(window.web3.currentProvider);
      let contractInstance = new web3.eth.Contract(TABLE.abi);

      let bytecode = '0x' + TABLE.bytecode.object;
      contractInstance.options.data = bytecode;
      resolve(contractInstance)
    });

    try {
      let contract = await getContract;
      commit('registerContract', {
        contract: contract
      });
    } catch(e) {}
  }
}
