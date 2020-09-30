<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <template v-if="$store.state.model.dab.hash">
    <h1>Tableau de consommation des DABs</h1>
    <dabTable :ipfs="$store.state.model.dab.hash" :readOnly="true" :consumed="true" />
  </template>
  <template v-else>
    <h2>Pas de tableau de consomation:</h2>
    <p>Il n'y a pas encore de tableau initial</p>
  </template>
  </div>
</template>

<script>
  import dabTable from '~/components/partials/dabTable';
  export default {
    layout: 'default',
    components: {
      dabTable
    }
  }
</script>
<style>
</style>
