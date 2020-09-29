<template v-if="this.$store.state.user.info.is_requerant">
  <div class="wrapper">
    <form v-on:submit="submitContract">
      <label for="parcelles">Couple Parcelle/Pool correspondant à des DABs: </label>
      <vSelect
        id="dabArray"
        :options="dabArray"
        v-model="selectedDab"
        required
      >
        <template slot="no-options">
          Chargement des couples Parcelle/Pool en cours...
        </template>
        <template slot="option" slot-scope="option">
          <div class="d-center">
            <p v-if="option">
                Parcelle: <strong>{{option.parcelle.id}}</strong> - Pool: <strong>{{option.pool.pool}}</strong>
                <br/>
                -> DAB: <strong>{{option.dab}}</strong>
            </p>
          </div>
        </template>
        <template slot="selected-option" slot-scope="option">
          <div class="d-center">
            <p v-if="option">
                Parcelle: <strong>{{option.parcelle.id}}</strong> - Pool: <strong>{{option.pool.pool}}</strong>
                <br/>
                -> DAB: <strong>{{option.dab}}</strong>
            </p>
          </div>
        </template>
      </vSelect>
      <br/>
      <label for="info">Information sur le contrat:</label>
      <textarea id="info" required placeholder="Entrez les informations prouvant la validité du contrat (origine, raison,...)" v-model="info"></textarea>
      <br/>
      <br/>
      <button type='submit'><i class="fa fa-save"></i> Enregistrer ce contrat pour validation</button>
    </form>
  </div>
</template>

<script>
  import { WEB3_BUS } from '~/services/web3';
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css';

  export default {
    layout: 'default',
    components: {vSelect},
    data() {
      return {
        dabArray: [],
        selectedDab: null,
        info: null,
      };
    },
    created() {
      if (this.$store.state.model.initialised) {
        this.init();
      } else {
        WEB3_BUS.$on('model-initialised', function() {
          this.init();
        }.bind(this));
      }
    },
    methods: {
      init() {
        this.parcelles = this.$store.state.model.dab.data.remote.parcelles;
        this.pools = this.$store.state.model.dab.data.remote.pools;

        this.dabArray = this.$model.dab().getRemoteDABArray();
        console.log(this.dabArray);
      },
      submitContract(event) {
        event.preventDefault();
        if (!this.selectedDab) {
          alert('Vous devez sélectionner un couple Parcelle/Pool');
          return false;
        }

        this.$model.requerant_contract_register().saveNewContract(this.selectedDab.parcelle, this.selectedDab.pool, this.info);
      }
    }
  }
</script>
<style>
</style>
