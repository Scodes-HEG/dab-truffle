<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <h2>Devenir administrateur</h2>
    <section class="admins">
      <form v-on:submit="add">
        <input style="width: 23em" type="email" v-model="newAdminEmail" placeholder="Mon email" required />
        <input type="submit" name="" value="Je voudrais devenir admin">
      </form>
    </section>
  </div>
</template>

<script>
  export default {
    layout: 'default',
    data() {
      return {
        newAdminEmail: null
      };
    },
    methods: {
      async add(event) {
        if (event) {
          event.preventDefault();
        }
        await this.$model.admins().addMe(this.newAdminEmail);
        this.newAdminEmail = null;
      }
    }
  }
</script>
<style>
</style>
