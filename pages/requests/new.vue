<template>
  <div class="wrapper">
    <h2>Déposez une nouvelle requête</h2>
    <form v-on:submit="_submit">
      <label for="contracts">Mes contrats non utilisés dans des requêtes validées</label>
      <vSelect
      id="contracts"
      :options="contracts"
      v-model="selectedContracts"
      :multiple="true"
      label="hash"
      required
      >
      <template slot="no-options">
        Si vous n'en avez pas encore enregistré, veuillez <router-link :to="'/requerants/new-contract'">créer un nouveau contrat</router-link>
      </template>
      <template slot="option" slot-scope="option">
        <div class="d-center">
          <p v-if="!option.data">{{ option.hash }}</p>
          <div v-if="option.data">
            <p>
              Parcelle: <strong>{{option.data.parcelle.id}}</strong> - Pool: <strong>{{option.data.pool.pool}}</strong>
              <p>Valeur DABs: <strong>{{option.data.dab}}</strong></p>
              <p>
                <pre>{{option.data.info}}</pre>
              </p>
            </p>
          </div>
        </div>
      </template>
      <template slot="selected-option" slot-scope="option">
        <div v-if="!option.data" class="selected d-center">
          {{ option.hash }}
        </div>
        <div v-if="option.data" class="selected d-center">
          <p>
            Parcelle: <strong>{{option.data.parcelle.id}}</strong> - Pool: <strong>{{option.data.pool.pool}}</strong>
          </p>
          <p>Valeur DABs: <strong>{{option.data.dab}}</strong></p>
        </div>
      </template>
    </vSelect>
    <br/>
    <p>DAB utilisable: <strong>{{dabSelected}}</strong></p>
    <h4>Les couples Parcelles/bâtiments compris dans la requête</h4>
    <hr/>
    <div :key="resetKey">
      <template v-for="n in numberOfRow">
        <div class="inline" style="width: 50%; padding-right: 1em; margin-right: 1em; border-right: 1px solid black">
          <label v-if="n < numberOfRow">Couple Parcelle/Bâtiment(s)</label>
          <label v-if="n == numberOfRow">Séléctionnez un nouveau couple Parcelle/Bâtiment(s)</label>
          <vSelect
          id="dabArray"
          v-model="selectedCouples[n - 1]"
          @input="inputChange(n, $event)"
          :options="dabArray"
          label="key"
          required
          >
          <template slot="no-options">
            Chargement des couples Parcelle/Pool en cours...
          </template>
          <template slot="option" slot-scope="option">
            <div class="d-center">
              <p v-if="option">
                Parcelle: <strong>{{option.parcelle.id}}</strong> - Pool: <strong>{{option.pool.pool}}</strong>
              </p>
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="d-center">
              <p v-if="option">
                Parcelle: <strong>{{option.parcelle.id}}</strong> - Pool: <strong>{{option.pool.pool}}</strong>
              </p>
            </div>
          </template>
                </vSelect>
        </div>
      <div class="inline" style="width: 39%">
        <label v-if="selectedCouples[n - 1]">Dab nécessaires pour cette partie: <input v-model="selectedCouples[n - 1].dab" v-on:change="setDabNecessary(n, $event)" type="number" required="true" min="0"></input></label>
      </div>

      <hr/>
        </template>
    </div>
  <br/>
  <p>Dab nécessaires pour ce projet: <strong>{{dabNecessary}}</strong></p>
  <br/>
  <label for="info">Entrez des informations complémentaires permettant d'analyser votre requête:</label>
  <textarea id="info" required placeholder="Lien vers les plans et différentes infos" v-model="info"></textarea>
  <br/>
  <br/>
  <template v-if="dabNecessary > 0">
    <strong><template v-if="dabSelected >= dabNecessary">
      <div style="color: green;">Vos contrats sont suffisants pour satisfaire le besoin en dab de votre projet</div>
    </template>
    <template v-if="dabSelected < dabNecessary">
      <div style="color: red;">Vos contrats ne sont pas suffisants pour satisfaire le besoin en dab de votre projet, il vous faudra une dérogation de {{Math.round(100 - (dabSelected*100/dabNecessary))}}%</div>
    </template></strong>
  </template>
  <br/>
  <button type='submit'><i class="fa fa-save"></i> Déposer cette requête pour validation</button>
</form>
</div>
</template>

<script>
  import { WEB3_BUS } from '~/services/web3';
  import { IPFS_MANAGER } from '~/services/ipfs';
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css';

  export default {
    layout: 'default',
    components: {vSelect},
    data() {
      return {
        contracts: [],
        selectedContracts: [],
        stepReset: 1,
        parcelles: [],
        selectedParcelles: [],
        pools: [],
        selectedPools: [],
        info: null,
        dabArray: [],
        selectedCouples: [],
        dabNecessary: 0,
        numberOfRow: 1,
        resetKey: 1
      }
    },
    computed: {
      dabSelected: function() {
        let sum = 0;
        for (let i = 0; i < this.selectedContracts.length; i++) {
          sum += Number(this.selectedContracts[i].data.dab);
        }
        return sum;
      }
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
      inputChange(n, couple) {
        if (n == this.numberOfRow) {
          this.numberOfRow++;
        }
        if (!couple) {
          this.selectedCouples = this.selectedCouples.filter(a => a);
          this.numberOfRow = this.selectedCouples.length + 1;
          this.resetKey++;
        }
        this.computeDabNecessary();
      },
      setDabNecessary(n, event) {
        this.computeDabNecessary();
      },
      computeDabNecessary() {
        let dabNecessary = 0;
        for (let i = 0; i < this.selectedCouples.length; i++) {
          if (this.selectedCouples[i] && this.selectedCouples[i].dab) {
            dabNecessary += Number(this.selectedCouples[i].dab);
          }
        }
        this.dabNecessary = dabNecessary;
      },
      async init() {
        this.parcelles = this.$store.state.model.dab.data.remote.parcelles;
        this.pools = this.$store.state.model.dab.data.remote.pools;

        this.dabArray = this.$model.dab().getRemoteDABArray();

        let currentAdress = this.$store.state.web3.coinbase;
        let requests = await this.$model.request_register().getRequests(currentAdress);
        let accepteds = requests.accepted;
        let filterAccepteds = [];
        for (let i = 0; i < accepteds.length; i++) {
            let request = await this.$model.request_register().readRequest(accepteds[i]);
            if (request.contracts) {
              for (let j = 0; j < request.contracts.length; j++) {
                filterAccepteds.push(request.contracts[j].address);
              }
            }
        }
        this.$model.requerant_contract_register().getContracts(currentAdress).then((contracts) => {
          contracts = contracts.filter(c => {
            let address = c.address;
            return filterAccepteds.indexOf(address) == -1;
          });
          contracts = contracts.reverse();
          this.contracts = contracts;
          this.stepReset++;
          for(let j = 0; j < contracts.length; j++) {
            let contract = contracts[j];
            IPFS_MANAGER.read(contract.hash).then(function (data) {
              data = JSON.parse(data);
              this.currentVue.contracts[this.j].data = data;
              let dab = this.currentVue.$model.dab().getRemoteParcellePoolDABs(data.parcelle.uuid, data.pool.uuid);
              this.currentVue.contracts[this.j].data.dab = dab;
              this.currentVue.stepReset++;
            }.bind({
              currentVue: this,
              j: j,
            }));
          }
        })
      },
      _submit(event) {
        event.preventDefault();
        if (!this.info) {
          alert('Vous devez sélectionner un pool');
          return false;
        }

        this.selectedCouples = this.selectedCouples.filter(a => a);
        console.log(this.selectedCouples);

        this.$model.request_register().saveNewRequest(this.selectedContracts, this.selectedCouples, this.dabNecessary, this.info);
      }
    }
  }
</script>
<style>
</style>
