<template>
    <default-layout>
    <section class="shared-table" v-if="shareTableNetwork">
    <div class="wrapper" v-if="$store.state.web3.networkId != shareTableNetwork">
      <h2>Not connected where you should be !</h2>
      You are <span v-if="networkName">connected on the <strong>{{networkName}}</strong></span><span v-if="!networkName"><strong>NOT connected</strong></span> and you should be connected on the <strong>{{shareTableNetworkName}}</strong>
    </div>
      <nuxt v-if="$store.state.web3.networkId == shareTableNetwork" />
    </section>
  </default-layout>
</template>

  <script>
    import { mapGetters } from 'vuex';
    import { NETWORKS } from '~/services/constants/ethereum_networks';
    import DAB from '~/services/constants/dab';
    import editTable from '~/components/editTable';
    import DefaultLayout from '~/layouts/default.vue';
    export default {
      layout: 'default',
      components: {
        DefaultLayout,
        editTable
      },
      data() {
        return {
          shareTableNetwork: null
        }
      },
      computed: {
        ...mapGetters({
          web3: 'web3/getInstance',
        }),
        networkName: state => NETWORKS[state.web3.networkId],
        shareTableNetworkName: state => NETWORKS[DAB.network],
      },
      mounted() {
        this.shareTableNetwork = DAB.network;
      }
    }
  </script>

  <style>
  .wrapper, .shared-table {
    width: 100%;
  }
</style>
