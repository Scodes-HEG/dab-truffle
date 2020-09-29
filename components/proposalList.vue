<template>
  <section class="proposalList">
    <p v-if="proposalList.length > 1">
    La liste est ordonnée par date de proposition (la première proposition en premier)</p>
    <ul>
      <li v-for="(proposalId, index) in proposalList">
        Proposition {{proposalId}}
        <dabTable :ipfs="proposalId" v-on:select="select(proposalId)" v-on:copy="copy(proposalId)" />
      </li>
    </ul>
  </section>
</template>

<script>
  import dabTable from '~/components/partials/dabTable';
  import {WEB3_BUS} from '~/services/web3';

  export default {
    components: {
      dabTable
    },
    data() {
      return {
        DABModel: null
      }
    },
    computed: {
      proposalList: function() {
        return this.DABModel.proposalIds();
      }
    },
    async created() {
      this.DABModel = this.$model.dab();
    },
    methods: {
      select(proposalId) {
        if(!confirm("Êtes-vous sûr d'accepter ce tableau comme nouveau tableau de référence ? Les autres propositions ne seront plus accessible.")) {
          return false;
        }

        WEB3_BUS.$on('proposal-accepted', () => {
          this.$router.push('table')
        });
        return this.DABModel.acceptProposal(proposalId);
      },
      copy(proposalId, toConfirm = true) {
        if(toConfirm && !confirm("Êtes-vous sûr de vouloir remplacer votre tableau local par ce tableau-ci ? Vos modifications locales seront écrasées.")) {
          return false;
        }

        return this.DABModel.copyProposal(proposalId).then((local) => {
          this.$router.push('edit')
          return true;
        });
      }
    }
  }
</script>

<style>
  .proposalList ul > li {
    margin-bottom: 2em;
  }
</style>
