<template>
  <tr>
    <td><a target="_blank" :href="url">{{id}}</a></td>
    <td>{{account.patronyme}}<br/> ({{account.email}})</td>
    <template v-if="loading">
      <td>Chargement en cours...</td>
      <td></td>
      <td></td>
      <td></td>
      <td>
        <template v-if="!$store.state.user.info.is_admin">
          <router-link to="/admins/request">Demander à devenir admin</router-link>
        </template>
      </td>
    </template>
    <template v-if="!loading">
      <td><ul>
        <li v-for="couple in couples"><strong>{{couple.parcelle.id}}</strong>/<strong>{{couple.pool.pool}}</strong> | <strong>{{couple.dab}}</strong></li>
      </ul></td>
      <td><p v-html="info"></p></td>
      <td><strong>{{dabNecessary}}</strong></td>
      <td>
        <template>
          <button v-on:click="toggle"><i class="fa fa-eye"></i> Afficher</button>
        </template>
      </td>
      <td>
        <template v-if="!$store.state.user.info.is_admin">
          <router-link to="/admins/request">Demander à devenir admin</router-link>
        </template>
        <template v-if="$store.state.user.info.is_admin">
          <template v-if="state == 0">
            <button class="inline" v-on:click="accept"><i class="fa fa-check"></i> Accepter</button>
            <button class="inline" v-on:click="refuse"><i class="fa fa-times"></i> Refuser</button>
          </template>
          <template v-if="state == 1">
            <button class="inline" v-on:click="pend"><i class="fa fa-question"></i> Remettre en cours...</button>
            <button class="inline" v-on:click="refuse"><i class="fa fa-times"></i> Refuser</button>
          </template>
          <template v-if="state == 2">
            <button class="inline" v-on:click="pend"><i class="fa fa-question"></i> Remettre en cours...</button>
            <button class="inline" v-on:click="accept"><i class="fa fa-check"></i> Accepter</button>
          </template>
        </template>
      </td>
      <modal
      :name="'modal-'+id"
      :adaptive="true"
      :reset="true"
      :scrollable="true"
      height="auto"
      >
        <h4>Contrats liée à la requête</h4>
        <ul>
          <li v-for="contract in contracts">
            Parcelle {{contract.data.parcelle.id}} | Pool {{contract.data.pool.pool}}<br/>
            <pre v-html="contract.data.info"></pre>
            <p>Valeur dab: <strong>{{contract.data.dab}}</strong></p>
          </li>
        </ul>
        <h4>Total de dab:</h4>
        <ul>
          <li>
            <p><strong>{{dabTotal}}</strong></p>
          </li>
        </ul>
        <h4>Dab nécessaire:</h4>
        <ul>
          <li>
            <p><strong>{{dabNecessary}}</strong></p>
          </li>
        </ul>
        <h4>Dérogation nécessaire si validation de la requète:</h4>
        <ul>
          <li>
            <p>
              <strong>{{derogation}} %</strong>
            </p>
          </li>
        </ul>
      </modal>
    </template>
  </tr>
</template>

<script>
  import { IPFS_MANAGER } from '~/services/ipfs';
  import { WEB3_BUS } from '~/services/web3';
  import { ETHERSCAN_URL } from '~/services/ethereum';

  export default {
    props: ['address', 'account', 'state'],
    data() {
      return {
        loading: true,
        open: false,
        id: null,
        contracts: null,
        info: null,
        url: null,
        couples: [],
        dabTotal: 0,
        dabNecessary: 0,
        derogation: 0
      }
    },
    async mounted() {
      this.id = this.address.substr(this.address.length - 4);
      this.url = ETHERSCAN_URL(this.$store.state.web3.networkId, '/address/'+this.address);
      let request = await this.$model.request_register().readRequest(this.address);
      this.couples = request.couples
      this.dabNecessary = request.dabNecessary
      this.contracts = request.contracts;
      for (let i =0; i < this.contracts.length; i++) {
        let data = this.contracts[i].data;
        data.dab = this.$model.dab().getRemoteParcellePoolDABs(data.parcelle.uuid, data.pool.uuid)
        this.dabTotal += Number(data.dab);
        this.contracts[i].data = data;
      }
      this.derogation = Math.round(100 - (this.dabTotal*100/this.dabNecessary));
      if (this.derogation < 0) {
        this.derogation = 0;
      }
      this.info = request.info;
      this.pools = request.pools;
      this.loading = false;

    },
    methods: {
      toggle() {
        this.$modal.show('modal-'+this.id);
      },
      async accept() {
        await this.$model.request_register().acceptRequest(this.address);
        WEB3_BUS.$emit('list-updated');
      },
      async refuse() {
        await this.$model.request_register().refuseRequest(this.address);
        WEB3_BUS.$emit('list-updated');
      },
      async pend() {
        await this.$model.request_register().pendRequest(this.address);
        WEB3_BUS.$emit('list-updated');
      }
    }
  }
</script>
