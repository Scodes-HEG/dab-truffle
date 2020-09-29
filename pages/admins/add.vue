<template>
  <div class="wrapper" v-if="$store.state.model.initialised">
    <h2>Gestions des administrateurs</h2>
    <section v-if="!$store.state.admins.requests.dataIsEmpty">
      <h2>Liste des demandes pour devenir admin</h2>
      <ul>
        <li v-for="(email, address) in $store.state.admins.requests.data">{{email}} <button v-on:click="accept(address)"><i class="fa fa-check"></i> Accepter</button> <button v-on:click="refuse(address)"><i class="fa fa-times"></i> Refuser</button></li>
      </ul>
    </section>
    <section class="admins">
      <h2>Ajouter un admin par son adresse blockchain</h2>
      <form v-on:submit="add">
        <input style="width: 23em" type="text" v-model="newAdminAddress" placeholder="Adresse blockchain" />
        <input type="submit" name="" value="Ajouter en tant qu'admin">
      </form>
    </section>
    <section class="admins">
      <h2>Se retirer de la liste des admins</h2>
        <button v-on:click="dontWantItAnymore"><i class="fa fa-time"></i> Je ne veux plus être admin !</button>
    </section>
  </div>
</template>

<script>
  export default {
    layout: 'default',
    data() {
      return {
        newAdminAddress: null
      };
    },
    methods: {
      async add(event) {
        if (event) {
          event.preventDefault();
        }
        await this.$model.admins().add(this.newAdminAddress);
        this.newAdminAddress = null;
      },
      async dontWantItAnymore() {
        await this.$model.admins().removeMe();
      },
      async accept(address) {
        await this.$model.admins().accept(address);
      },
      async refuse(address) {
        await this.$model.admins().refuse(address);
      }
    }
  }
</script>
<style>
</style>
