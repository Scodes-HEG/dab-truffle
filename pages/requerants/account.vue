<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <template v-if="!$store.state.user.info.is_requerant">
      <h2>Créer votre compte requérant</h2>
    </template>
    <template v-if="$store.state.user.info.is_requerant">
      <h2>Modifier votre compte requérant</h2>
    </template>
    <form v-on:submit="create">
      <label>Patronyme: <input type="text" name="name" v-model="patronyme" required></label>
      <label>Email: <input type="email" name="email" v-model="email" required></label>
      <br/>
      <button type="submit"><i class="fa fa-save"></i> Enregistrer</button>
    </form>
    <hr/>
    <template v-if="$store.state.user.info.is_requerant">
      <h2>Mes contrats</h2>
      <p v-if="!contratsLoaded">Contrats en cours de chargement...</p>
      <div v-if="contratsLoaded">
        <p>Total DABs: <strong>{{dabTotal}}</strong></p>
        <ul :key="stepReset">
          <li v-for="contract in contracts">
            <p><a target="_blank" :href="contract.url">Contrat {{contract.address}}</a></p>
            <div v-if="contract.data">
              <p>Parcelle: <strong>{{contract.data.parcelle.id}}</strong></p>
              <p>Pool: <strong>{{contract.data.pool.pool}}</strong></p>
              <p>Valeur DABs: <strong>{{contract.data.dab}}</strong></p>
              <pre>{{contract.data.info}}</pre>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
  import {WEB3_BUS} from '~/services/web3';
  import { IPFS_MANAGER } from '~/services/ipfs';
  import { ETHERSCAN_URL } from '~/services/ethereum';

  export default {
    layout: 'default',
    data() {
      return {
        patronyme: null,
        email: null,
        dabTotal: 0,
        contracts: null,
        stepReset: 1,
        contratsLoaded: false
      };
    },
    created() {
      if (this.$store.state.model.requerants.read) {
        this.init();
      } else {
        WEB3_BUS.$on('model-initialised', function() {
          this.init();
        }.bind(this));
      }
    },
    methods: {
      async init() {
        if (this.$store.state.user.info.is_requerant) {
          this.patronyme = this.$store.state.user.info.requerant_account.patronyme;
          this.email = this.$store.state.user.info.requerant_account.email;
        }
        let contracts = await this.$model.requerant_contract_register().getContracts(this.$store.state.web3.coinbase);
        contracts = contracts.reverse();
        this.contracts = contracts;
        this.contratsLoaded = true;
        for(let j = 0; j < this.contracts.length; j++) {
          let contract = this.contracts[j];
          this.contracts[j].url = ETHERSCAN_URL(this.$store.state.web3.networkId, '/address/'+contract.address);
          IPFS_MANAGER.read(contract.hash).then(function (data) {
            data = JSON.parse(data);
            this.currentVue.contracts[this.j].data = data;
            let dab = this.currentVue.$model.dab().getRemoteParcellePoolDABs(data.parcelle.uuid, data.pool.uuid);
            this.currentVue.dabTotal += dab;
            this.currentVue.contracts[this.j].data.dab = dab;
            this.currentVue.stepReset++;
          }.bind({
            currentVue: this,
            j: j
          }))
        }
      },
      async create(event) {
        event.preventDefault();
        let patronyme = this.patronyme;
        let email = this.email;
        this.$model.requerants().setAccount(this.$store.state.web3.coinbase, email, patronyme);
      }
    }
  }
</script>
<style>
</style>
