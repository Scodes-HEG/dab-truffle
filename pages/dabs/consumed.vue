<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <h1>Tableau de consommation des DABs</h1>
    <dabTable :ipfs="$store.state.model.dab.hash" :readOnly="true" :consumed="true" />
  </div>
</template>

<script>
  import dabTable from '~/components/partials/dabTable';
  export default {
    layout: 'dab',
    components: {
      dabTable
    }
  }
</script>
<style>
</style>
