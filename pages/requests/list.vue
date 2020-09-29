<template>
  <div class="wrapper">
    <h2>Liste des requêtes</h2>
    <div :key="initStep">
      <template v-if="pendings.length > 0">
        <h3>Requêtes en cours</h3>
        <table>
          <tr>
            <th>#</th>
            <th>Requérants</th>
            <th>Parcelles/Bâtiments | DAB</th>
            <th>Info fournis</th>
            <th>Dab nécessaire pour le projet</th>
            <th>Analyse</th>
            <th>Action</th>
          </tr>
          <requestTableRow
            v-for="pending in pendings" :key="pending.id"
            :address="pending.address"
            :account="pending.account"
            v-on:status-update="init"
            :state="0"
          />
        </table>
      </template>
      <template v-if="accepteds.length > 0">
        <h3>Requêtes acceptés</h3>
        <table>
          <tr>
            <th>#</th>
            <th>Requérants</th>
            <th>Parcelles/Bâtiments</th>
            <th>Info fournis</th>
            <th>Dab nécessaire pour le projet</th>
            <th>Analyse</th>
            <th>Action</th>
          </tr>
          <requestTableRow
            v-for="accepted in accepteds" :key="accepted.id"
            :address="accepted.address"
            :account="accepted.account"
            v-on:status-update="init"
            :state="1"
          />
        </table>
      </template>
      <template v-if="refuseds.length > 0">
        <h3>Requêtes refusées</h3>
        <table>
          <tr>
            <th>#</th>
            <th>Requérants</th>
            <th>Parcelles/Bâtiments</th>
            <th>Info fournis</th>
            <th>Dab nécessaire pour le projet</th>
            <th>Analyse</th>
            <th>Action</th>
          </tr>
          <requestTableRow
            v-for="refused in refuseds" :key="refused.id"
            :address="refused.address"
            :account="refused.account"
            v-on:status-update="init"
            :state="2"
          />
        </table>
      </template>
    </div>
  </div>
</template>

<script>
import { WEB3_BUS } from '~/services/web3';
import requestTableRow from '~/components/partials/requestTableRow';

export default {
  components: {
    requestTableRow
  },
  layout: 'default',
  data() {
    return {
      accounts: [],
      pendings: [],
      accepteds: [],
      refuseds: [],
      initStep: 1
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

    WEB3_BUS.$on('list-updated', function() {
      setTimeout(function() {
        this.init();
      }.bind(this), 1000);
    }.bind(this));
  },
  methods: {
    async init() {
      this.pendings = [];
      this.accepteds = [];
      this.refuseds = [];
      this.accounts = await this.$model.requerants().getList();
      for (let i =0; i < this.accounts.length; i++) {
        let account = this.accounts[i];
        this.$model.request_register().getRequests(account.address).then(function(requests) {
          let that = this.that;
          let account = that.accounts[this.i];
          for(let i = 0; i < requests.pending.length; i++) {
            that.pendings.push({
              address: requests.pending[i],
              account: account,
              id: requests.pending[i]+'-'+Date.now(),

            });
          }
          for(let i = 0; i < requests.accepted.length; i++) {
            that.accepteds.push({
              id: requests.accepted[i]+'-'+Date.now(),
              account: account,
              address: requests.accepted[i]
            });
          }
          for(let i = 0; i < requests.refused.length; i++) {
            that.refuseds.push({
              id: requests.refused[i]+'-'+Date.now(),
              account: account,
              address: requests.refused[i]
            });
          }
          that.initStep++;
        }.bind({
          i: i,
          that: this,
        }));
      }
    }
  }
}
</script>

<style>
</style>
