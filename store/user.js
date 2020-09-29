import Web3 from 'web3'
import { ETHERSCAN_URL } from '~/services/ethereum';

export const state = () => ({
  info: {
    is_admin: false,
    is_requerant: false,
    requerant_account: null,
  },
  admin_loaded: false,
});

export const getters = {
  isAdmin: state => state.info.is_admin
};

export const mutations = {
  registerIsAdmin (state, isAdmin) {
    state.info.is_admin = isAdmin
    state.admin_loaded = true

  },
  registerReaquerantAccount (state, account) {
    state.info.is_requerant = !!account
    state.info.requerant_account = account
  },
};

export const actions = {
  async getUserInfo ({rootState, state, commit, dispatch}) {
    let address = rootState.web3.coinbase;
    let adminContractInstance = await rootState.admins.contract.instance;

    console.log('TO DO ON ETUDIE LE REQUERANT ET TOUT');
    let requerantAccount = this.$model.requerants().getAccount(address);
    commit('registerReaquerantAccount', requerantAccount);

    let isAdmin = await adminContractInstance().methods.isAdmin(address).call();
    commit('registerIsAdmin', isAdmin);

  }
}
