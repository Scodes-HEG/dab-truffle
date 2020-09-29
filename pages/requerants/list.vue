<template>
  <div class="wrapper">
    <h2>Liste des comptes requérants</h2>
    <div v-if="!$store.state.model.requerants.read">Chargement...</div>
    <table :key="stepReset" v-if="$store.state.model.requerants.read">
      <tr>
        <th>Email</th>
        <th>Patronyme</th>
        <th>Adresse</th>
        <th>Contrats</th>
        <th>Somme des DABs</th>
      </tr>
      <tr v-for="(account, index) in accounts">
        <td>{{account.email}}</td>
        <td>{{account.patronyme}}</td>
        <td>{{account.address}}</td>
        <td><ul>
          <li v-if="!account.contracts">Chargement en cours...</li>
          <li v-if="account.contracts && (account.contracts.length == 0)">Pas de contrat</li>
          <li v-for="(contract, index) in account.contracts">
            <strong><a target="_blank" :href="contract.url">{{contract.address}}</a></strong>
            <button v-if="!contract.show" v-on:click="toggle(contract)">Voir <i class="fa fa-eye"></i></button>
            <button v-if="contract.show" v-on:click="toggle(contract)">Cacher <i class="fa fa-eye-slash"></i></button>
            <div v-if="contract.show">
              <template v-if="!contract.data">
                hash: {{contract.hash}}<br/>
              </template>
              <template v-if="contract.data">
                <ul>
                  <li><strong>Parcelle</strong>: {{contract.data.parcelle.id}}</li>
                  <li><strong>Pool</strong>: {{contract.data.pool.pool}}</li>
                  <li><strong>DAB</strong>: {{contract.data.dab}}</li>
                  <li><pre>{{contract.data.info}}</pre></li>
                </ul>
              </template>
            </div>

          </li>
        </ul></td>
        <td>{{account.dabTotal}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { WEB3_BUS } from '~/services/web3';
  import { IPFS_MANAGER } from '~/services/ipfs';

  export default {
    layout: 'default',
    data() {
      return {
        accounts: [],
        stepReset: 1
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
      toggle(contract) {
        contract.show = !contract.show;
        this.stepReset++;
      },
      async init() {
        this.accounts = await this.$model.requerants().getList();

        for(let i =0; i < this.accounts.length; i++) {
          let contracts = await this.$model.requerant_contract_register().getContracts(this.accounts[i].address);
          this.accounts[i].contracts = contracts;
          this.stepReset++;
          this.accounts[i].dabTotal = 0;
          for(let j = 0; j < this.accounts[i].contracts.length; j++) {
            let contract = this.accounts[i].contracts[j];
            IPFS_MANAGER.read(contract.hash).then(function (data) {
              data = JSON.parse(data);
              this.currentVue.accounts[this.i].contracts[this.j].data = data;
              let dab = this.currentVue.$model.dab().getRemoteParcellePoolDABs(data.parcelle.uuid, data.pool.uuid);
              this.currentVue.accounts[this.i].dabTotal += dab;
              this.currentVue.accounts[this.i].contracts[this.j].data.dab = dab;
              this.currentVue.stepReset++;
            }.bind({
              currentVue: this,
              j: j,
              i: i,
            }))
          }
        }
      },
    }
  }
</script>
<style>
</style>
