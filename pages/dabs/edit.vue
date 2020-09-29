<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <h1>Tableau initial des DABs partagé</h1>
    <h2>Édition du tableau local</h2>
    <editTable />
  </div>
</template>

<script>
  import editTable from '~/components/editTable';
  export default {
    layout: 'dab',
    components: {
      editTable
    }
  }
</script>
<style>
</style>
