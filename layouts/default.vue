<template>
  <div class="main-wrapper ">
    <loading :active.sync="isLoading"
        :can-cancel="canCancel"
        :is-full-page="isLoadingFullPage"
        :loader="'dots'"
        :opacity="0.8"></loading>
    <aside>
      <li v-if="!ipfsNode">Ipfs Node <strong>NOT CONNECTED</strong> (waiting...)</li>
      <li v-if="ipfsNode">Ipfs Node <strong>Connected - jsIPFS version: {{ipfsNodeVersion}}</strong></li>
      <li v-if="!web3 || !web3.isInjected">MetaMask is <strong>NOT CONNECTED</strong> (waiting...) - <a href="">REFRESH</a></li>
      <li v-if="web3 && web3.isInjected">MetaMask <strong>Connected</strong> to <strong>{{networkName}} ({{web3.networkId}})</strong></li>
      <li v-if="web3 && web3.isInjected && (web3.networkId != oracleNetworkId)">
        <strong style="color: red">BE CAREFUL: YOU SHOULD BE CONNECTED TO THE {{oracleNetworkName}} !</strong>
      </li>
      <li v-if="web3 && web3.isInjected">Ethereum Account n°<strong>{{web3.coinbase}}</strong></li>
      <hr/>
    </aside>
    <main>
      <nav v-if="ipfsNode && web3">
        <ul>
            <li v-bind:class="{ active: ($nuxt.$route.path == '/') || ($nuxt.$route.path == '/') }"><nuxt-link to="/">Accueil</nuxt-link></li>

            <li class="separator"></li>
            <li class="separator">Droits à bâtir:</li>
            <template v-if="!$store.state.model.dab.read">
              <li class="separator">En cours de chargement</li>
            </template>
            <template v-if="$store.state.model.dab.read">
              <li v-bind:class="{ active: ($nuxt.$route.path == '/dabs/edit') || ($nuxt.$route.path == '/dabs/edit/') }"><nuxt-link to="/dabs/edit">Édition locale</nuxt-link></li>
              <li v-if="$store.state.model.dab.proposalIds.length" v-bind:class="{ active: ($nuxt.$route.path == '/dabs/proposals') || ($nuxt.$route.path == '/dabs/proposals/') }"><nuxt-link to="/dabs/proposals">Propositions</nuxt-link></li>
              <li v-if="$store.state.model.dab.data.remote" v-bind:class="{ active: ($nuxt.$route.path == '/dabs/table') || ($nuxt.$route.path == '/dabs/table/') }"><nuxt-link to="/dabs/table">Tableau initial</nuxt-link></li>
            </template>

            <li class="separator"></li>
            <li class="separator">Requérants:</li>
            <template v-if="!$store.state.model.requerants.read">
              <li class="separator">En cours de chargement</li>
            </template>
            <template v-if="$store.state.model.requerants.read">
              <li v-bind:class="{ active: ($nuxt.$route.path == '/requerants/list') || ($nuxt.$route.path == '/requerants/list/') }"><nuxt-link to="/requerants/list">Liste des comptes</nuxt-link></li>
              <li v-if="$store.state.user.info.is_requerant" v-bind:class="{ active: ($nuxt.$route.path == '/requerants/new-contract') || ($nuxt.$route.path == '/requerants/new-contract/') }"><nuxt-link to="/requerants/new-contract"><i class="fa fa-plus"></i> Nouveau contract</nuxt-link></li>
              <li v-if="$store.state.user.info.is_requerant" v-bind:class="{ active: ($nuxt.$route.path == '/requerants/account') || ($nuxt.$route.path == '/requerants/account/') }"><nuxt-link to="/requerants/account">Mon&nbsp;compte / Mes&nbsp;contrats</nuxt-link></li>
              <li v-if="!$store.state.user.info.is_requerant" v-bind:class="{ active: ($nuxt.$route.path == '/requerants/account') || ($nuxt.$route.path == '/requerants/account/') }"><nuxt-link to="/requerants/account">Créer compte</nuxt-link></li>
            </template>

            <template>
            <li class="separator"></li>
            <li class="separator">Requêtes:</li>
            <li v-if="$store.state.model.requerants.read && $store.state.user.info.is_requerant" v-bind:class="{ active: ($nuxt.$route.path == '/requests/new') || ($nuxt.$route.path == '/requests/new/') }"><nuxt-link to="/requests/new"><i class="fa fa-plus"></i> Nouvelle requête</nuxt-link></li>
            <li v-bind:class="{ active: ($nuxt.$route.path == '/requests/list') || ($nuxt.$route.path == '/requests/list/') }"><nuxt-link to="/requests/list"> Liste des requêtes</nuxt-link></li>
            <li v-if="$store.state.model.requerants.read" v-bind:class="{ active: ($nuxt.$route.path == '/dabs/consumed') || ($nuxt.$route.path == '/dabs/consumed/') }"><nuxt-link to="/dabs/consumed">Tableau de consommation</nuxt-link></li>
            <template v-if="!$store.state.model.requerants.read">
              <li class="separator">En cours de chargement</li>
            </template>
          </template>

            <li class="separator"></li>
            <li class="separator">Administrateur:</li>
            <template v-if="!$store.state.user.admin_loaded">
              <li class="separator">En cours de chargement</li>
            </template>
            <template v-if="$store.state.user.admin_loaded">
              <li v-if="!$store.state.user.info.is_admin" v-bind:class="{ active: ($nuxt.$route.path == '/admins/request') || ($nuxt.$route.path == '/admins/request/') }"><nuxt-link to="/admins/request">Devenir un admin</nuxt-link></li>
              <li v-if="$store.state.user.info.is_admin" v-bind:class="{ active: ($nuxt.$route.path == '/admins/add') || ($nuxt.$route.path == '/admins/add/') }"><nuxt-link to="/admins/add">Gestion des admins</nuxt-link></li>
            </template>

        </ul>
      </nav>
      <section v-if="ipfsNode && web3" >
        <nuxt />
      </section>
    </main>
  </div>
</template>

<script>
import ORACLE from '~/services/constants/oracle';
import { mapGetters } from 'vuex';
import { IPFS_MANAGER } from '~/services/ipfs';
import { NETWORKS } from '~/services/constants/ethereum_networks';
import { WEB3_BUS } from '~/services/web3';
import { Notifier } from '~/services/notifier.js';
import {LOADER_EVENT} from '~/services/loader.js';
import DABModel from '~/models/dab.js';
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
      Loading
  },
  data() {
    return {
      ipfsNode: null,
      ipfsNodeVersion: null,
      isLoading: true,
      isLoadingFullPage: true,
      canCancel: false,
      oracleNetworkId: null,
      oracleNetworkName: null,
    }
  },
  mounted() {
    this.oracleNetworkName = NETWORKS[ORACLE.network];
    this.oracleNetworkId   = ORACLE.network;
  },
  computed: {
    ...mapGetters({
      web3: 'web3/getInstance',
    }),
    networkName: state => NETWORKS[state.web3.networkId],
  },
  async created() {
    LOADER_EVENT.$on('on', () => {
      this.isLoading = true;
    });
    LOADER_EVENT.$on('off', () => {
      this.isLoading = false;
    });

    await this.initIPFS();
    if(!this.$store.state.model.initialised) {
      this.initDB();
    }
    this.isLoading = false;
    this.canCancel = true;
  },
  methods: {
    async initIPFS() {
      if (!this.ipfsNode) {
        this.ipfsNode = await IPFS_MANAGER.getNode();
        let ipfsNodeVersion = (await this.ipfsNode.version());
        if (ipfsNodeVersion) {
          this.ipfsNodeVersion = ipfsNodeVersion.version;
        }
      }
    },
    initDB() {
      WEB3_BUS.$on('init', async () => {
        Notifier.log('WEB3_STORE INITED', this.web3);
        await this.$store.dispatch('oracle/getContractInstance');
        this.$store.dispatch('request/getContractInstance');
        this.$store.dispatch('request_register/getContractInstance');
        // this.$store.dispatch('requerant_dab_contract_register/getContractInstance');
        // this.$store.dispatch('requerant_dab_contract/getContractInstance');
        // await this.$store.dispatch('admins/getContractInstance');
        // await this.$store.dispatch('user/getUserInfo');
        // await this.$store.dispatch('model/init');
      });

      WEB3_BUS.$on('updated', async () => {
        await this.$store.dispatch('user/getUserInfo');
      });

      this.$store.dispatch('web3/registerWeb3');
    }
  }
}
</script>
<style>
  body, .main-wrapper {
    /*max-width: 1200px;*/
    max-width: 100%;
    min-height: calc(100vh - 40px);
  }

  .main-wrapper {
    display: flex;
    flex-direction: column;
  }

  main {
    display: flex;
    flex-grow: 1;
  }

  main>section {
    flex-grow: 1;
  }

  nav {
    width: 200px;
    margin-right: 3em;
    border-right: 1px solid black;
  }

  nav ul {
    padding-left: 0;
  }

  nav li {
    list-style: none;
  }

  nav li:before {
      display: inline;
      content: "- ";
  }

  nav li.separator:before {
      display: inline-block;
      content: "";
  }

  nav li.active {
    font-weight: bold;
  }

  nav li.active:before {
      content: "->";
  }

</style>
