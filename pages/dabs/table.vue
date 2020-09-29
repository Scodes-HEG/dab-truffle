<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <h1>Tableau initial des DABs partagé</h1>
    <h2>Tableau validé</h2>
    <dabTable :ipfs="$store.state.model.dab.hash" :readOnly="true" />
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
