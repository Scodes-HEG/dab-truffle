<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <h1>Tableau initial des DABs partagé</h1>
    <h2>Liste des propositions</h2>
    <proposalList />
  </div>
</template>

<script>
  import proposalList from '~/components/proposalList';
  export default {
    layout: 'dab',
    components: {
      proposalList
    }
  }
</script>
<style>
</style>
