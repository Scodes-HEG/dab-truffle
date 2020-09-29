import { WEB3_GET, WEB3_POLL, WEB3_BUS } from '~/services/web3';
import { Notifier } from '~/services/notifier.js';

export const state = () => ({
  isInjected: false,
  web3Instance: null,
  networkId: null,
  coinbase: null,
  balance: null,
  error: null,
});

export const getters = {
  getInstance: state => state,
};

export const mutations = {
  registerWeb3Instance (state, payload) {
    Notifier.log('WEB3_STORE: registerWeb3Instance Mutation being executed', state, payload)
    let result = payload
    let web3Copy = state
    web3Copy.coinbase = result.coinbase
    web3Copy.networkId = result.networkId
    web3Copy.balance = parseInt(result.balance, 10)
    web3Copy.isInjected = result.injectedWeb3
    web3Copy.web3Instance = result.web3
    let toInit = !state;
    state = web3Copy;
    if (!toInit) {
      WEB3_BUS.$emit('init');
    }
    WEB3_POLL(this);
  },
  pollWeb3Instance (state, payload) {
    Notifier.log('pollWeb3Instance mutation being executed', payload)
    state.coinbase = payload.coinbase
    state.balance = parseInt(payload.balance, 10)
    WEB3_BUS.$emit('updated');
  },
};

export const actions = {
  async registerWeb3 ({commit}) {
    Notifier.log('WEB3_STORE: registerWeb3 Action being executed')
    WEB3_GET().then(result => {
      Notifier.log('WEB3_STORE: committing result to registerWeb3Instance mutation')
      commit('registerWeb3Instance', result)
    }).catch(e => {
      Notifier.error('WEB3_STORE: error in action registerWeb3', e)
    })
  },
  pollWeb3 ({commit}, payload) {
    Notifier.log('WEB3_STORE: pollWeb3 action being executed')
    commit('pollWeb3Instance', payload)
  },
};
