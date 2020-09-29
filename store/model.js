import { WEB3_BUS } from '~/services/web3';
import { Notifier } from '~/services/notifier.js';

export const state = () => ({
  initialised: false
});

export const mutations = {
  registerInitialised (state, payload) {
    Notifier.log('MODEL_STORE: registerInitialised mutation', payload);
    state.initialised = payload
    WEB3_BUS.$emit('model-initialised');
  },
}

export const actions = {
  async init (context) {
    // context.dispatch => action
    // context.commit => mutation

    Notifier.log('MODEL_STORE: start initialisation');
    await context.dispatch('dab/getContractInstance');
    await context.dispatch('dab/readContract');
    await context.dispatch('requerants/getContractInstance');
    await context.dispatch('requerants/readContract');

    context.commit('registerInitialised', true);
  }
};
