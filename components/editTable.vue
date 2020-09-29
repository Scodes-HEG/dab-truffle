<template>
  <section class="editTable">

    <h3>Liste des parcelles</h3>
    <a v-if="parcellesEditClick" v-on:click="parcellesEditClick = !parcellesEditClick">Cacher</a>
    <a v-if="!parcellesEditClick" v-on:click="parcellesEditClick = !parcellesEditClick">Montrer</a>
    <div v-if="parcellesEditClick" class="editWrapper">
      <draggable v-model="parcelles" v-on:end="saveParcelles()">
        <div v-for="(parcelle, index) in parcelles">
          <i class="fa fa-arrows handle"></i>
          <template v-if="index == 0">
            <label class="inline">Identifiant<br/>
              <input  type="string" v-model="parcelles[index].id" v-on:change="saveParcelles()">
            </label>
            <label class="inline">Surface<br/>
              <input class="inline" type="number" v-model="parcelles[index].surface" v-on:change="saveParcelles()">
            </label>
            <button class="commit" v-on:click="removeParcelle(index)">- Supprimer</button>
          </template>
          <template v-if="index != 0">
            <input class="inline" type="string" v-model="parcelles[index].id" v-on:change="saveParcelles()">
            <input class="inline" type="number" v-model="parcelles[index].surface" v-on:change="saveParcelles()">
            <button class="commit" v-on:click="removeParcelle(index)">- Supprimer</button>
          </template>
        </div>
      </draggable>
      <button class="commit"  v-on:click="addParcelle()">+ Ajouter une parcelle</button>
    </div>
    <br/>
    <hr/>

    <h3>Liste des pools de batiments</h3>
    <a v-if="poolsEditClick" v-on:click="poolsEditClick = !poolsEditClick">Cacher</a>
    <a v-if="!poolsEditClick" v-on:click="poolsEditClick = !poolsEditClick">Montrer</a>
    <div v-if="poolsEditClick" class="editWrapper">
      <draggable v-model="pools" v-on:end="savePools()">
        <div v-for="(pool, index) in pools">
          <i class="fa fa-arrows handle"></i>
          <template v-if="index == 0">
            <label class="inline">Bâtiments du pool<br/>(séparés par une virgule)<br/>
              <input class="inline" type="string" v-model="pools[index].pool" v-on:change="savePools()">
            </label>
            <button class="commit" v-on:click="removePool(index)">- Supprimer</button>
          </template>
          <template v-if="index != 0">
            <input class="inline" type="string" v-model="pools[index].pool" v-on:change="savePools()">
            <button class="commit" v-on:click="removePool(index)">- Supprimer</button>
          </template>
        </div>
      </draggable>
      <button class="commit"  v-on:click="addPool()">+ Ajouter un pool de bâtiment(s)</button>
    </div>
    <br/>
    <hr/>

    <h3>Tableau initial des droits</h3>
    <a v-if="dabsEditClick" v-on:click="dabsEditClick = !dabsEditClick">Cacher</a>
    <a v-if="!dabsEditClick" v-on:click="dabsEditClick = !dabsEditClick">Montrer</a>
    <table v-if="dabsEditClick">
      <tr>
        <th colspan="3">Tableau de répartition des droits à bâtir</th>
        <th v-bind:colspan="pools.length">Localisation des droits à bâtir</th>
      </tr>
      <tr>
        <th rowspan="2">Parcelle N°</th>
        <th rowspan="2">Surface<br/>Parcelle<br/>en ZD3</th>
        <th rowspan="2">DAB</th>
        <th v-for="(pool, index) in pools" v-bind:width="(100/(3+pools.length))+'%'">BAT</th>
      </tr>
      <draggable v-model="pools" tag="tr" v-on:end="savePools()">
        <th class="handle" v-for="(pool, index) in pools">{{pool.pool}}</th>
      </draggable>
      <tr class="draggableParcelle" v-for="(parcelle, index) in parcelles">
        <th v-if="parcelle">{{parcelle.id}}</th>
        <td v-if="parcelle">{{parcelle.surface}}</td>
        <th v-if="parcelle">{{DABModel.getLocalParcelleDABs(parcelle.uuid)}}</th>
        <td v-for="(pool, index) in pools">
          <input v-if="parcelle" type="number" min="0" v-bind:value="DABModel.getLocalParcellePoolDABs(parcelle.uuid, pool.uuid)" v-on:change="saveDABs(parcelle.uuid, pool.uuid, $event)">
        </td>
      </tr>
      <tr>
        <th>TOTAL</th>
        <th>{{DABModel.getLocalSurfaceTotal()}}</th>
        <th>{{DABModel.getLocalDABs()}}</th>
        <th v-for="(pool, index) in pools">{{DABModel.getLocalPoolDABs(pool.uuid)}}</th>
      </tr>
    </table>

    <aside id="flyingMenu" v-if="isDiff || isDiffParcelles || isDiffPools">
      <nav>
        <p>Votre tableau est local est différent du tableau de référence</p>
        <button class="success" v-on:click="proposeLocal()"><i class="fa fa-arrow-right"></i> Proposer comme nouveau tableau de référence</button>
        <button v-if="isDiff" class="alert" v-on:click="pullRemote()"><i class="fa fa-times"></i> Revenir au tableau de référence</button>
        <button v-if="!isDiff && isDiffParcelles" class="alert" v-on:click="pullRemoteParcelles()"><i class="fa fa-times"></i> Revenir aux parcelles du tableau de référence</button>
        <button v-if="!isDiff && isDiffPools" class="alert" v-on:click="pullRemotePools()"><i class="fa fa-times"></i> Revenir aux pools de bâtiments du tableau de référence</button>
      </nav>
    </aside>
  </section>
</template>

<script>
  import draggable from 'vuedraggable';
  import {WEB3_BUS} from '~/services/web3';

  export default {
    components: {
      draggable
    },
    data() {
      return {
        parcelles: [],
        pools: [],
        dabs: {},
        parcellesEditClick: false,
        poolsEditClick: false,
        dabsEditClick: true,
        DABModel: null,
        isDiff: false,
        isDiffParcelles: false,
        isDiffPools: false,
        isDiffInterval: null,
      }
    },
    async created() {
      this.DABModel = this.$model.dab();
      this.initLocal();
      if (!this.isDiffInterval) {
        this.isDiffInterval = setInterval(() => {
          this.isDiff = this.DABModel.isDiff();
          this.isDiffParcelles = this.DABModel.isDiffParcelles();
          this.isDiffPools = this.DABModel.isDiffPools();
        }, 1000);
      }
    },
    beforeDestroy () {
      if (this.isDiffInterval) {
        clearInterval(this.isDiffInterval);
      }
    },
    methods: {
      initLocal() {
      this.parcelles = this.DABModel.getLocalParcelles();
      if (!this.parcelles.length) {
        this.parcellesEditClick = true;
      }
      this.pools = this.DABModel.getLocalPools();
      if (!this.pools.length) {
        this.poolsEditClick = true;
      }
      if (!this.parcelles.length && !this.pools.length) {
        this.dabsEditClick = false;
      }

      },
      addParcelle() {
        this.DABModel.addNewLocalParcelle();
        this.parcelles = this.DABModel.getLocalParcelles();
      },
      removeParcelle(index) {
        this.DABModel.removeParcelle(this.parcelles[index].uuid);
        this.parcelles = this.DABModel.getLocalParcelles();
      },
      saveParcelles() {
        this.DABModel.saveLocalParcelles(this.parcelles);
      },
      addPool() {
        this.DABModel.addNewLocalPool();
        this.pools = this.DABModel.getLocalPools();
      },
      removePool(index) {
        this.DABModel.removePool(this.pools[index].uuid);
        this.pools = this.DABModel.getLocalPools();
      },
      savePools() {
        this.DABModel.saveLocalPools(this.pools);
      },
      saveDABs(parcelleUuid, poolUuid, event) {
        this.DABModel.saveLocalParcellePoolDABs(parcelleUuid, poolUuid, event.target.value);
      },
      proposeLocal() {
        WEB3_BUS.$on('proposal-created', () => {
          this.$router.push('proposals')
        });
        this.DABModel.proposeLocal();
      },
      async pullRemote() {
        if (!confirm("Êtes-vous sûr de vouloir revenir au tableau de référence ? Vos modifications seront perdues")) {
          return false;
        }
        await this.DABModel.pullRemote();
        this.initLocal();
      },
      async pullRemoteParcelles() {
        if (!confirm("Êtes-vous sûr de vouloir revenir aux parcelles du tableau de référence ? Vos modifications seront perdues")) {
          return false;
        }
        await this.DABModel.pullRemoteParcelles();
        this.initLocal();
      },
      async pullRemotePools() {
        if (!confirm("Êtes-vous sûr de vouloir revenir aux colonnes du tableau de référence ? Vos modifications seront perdues")) {
          return false;
        }
        await this.DABModel.pullRemotePools();
        this.initLocal();
      }
    }
  }
</script>
<style>
.inline {
  display: inline-block !important;
}

/*
Generic Styling, for Desktops/Laptops
*/
table {
  width: 100%;
  border-collapse: collapse;
}
/* Zebra striping */
tr:nth-of-type(odd) {
  background: #eee;
}
th {
  background: #333;
  color: white;
  font-weight: bold;
}
td, th {
  padding: 6px;
  border: 1px solid #ccc;
  text-align: left;
}
input[type="number"], input[type="string"], input[type="text"] {
  background-color: #f6f7e8;
}
table input[type="number"] {
  width: 4em;
  margin: 0;
  padding: 1px;
  height: 1.5em;
}

.handle {
  cursor: move;
}

aside#flyingMenu {
  position: fixed;
  top: 2em;
  right: 1em;
  display: flex;
  flex-direction: column;
}

#flyingMenu > nav {
  background: rgba(209, 240, 210, 0.7);
  border-radius: 1em;
  padding: 0.5em;
  margin-bottom: 0.5em;
  max-width: 15em;
}

#flyingMenu > nav > button {
  float: left;
}

button.success {
  background-color: hsla(125, 70%, 75%, 0.7);
}

button.success:hover {
  background-color: hsla(125, 70%, 75%, 1);
}

button.alert {
  background-color: hsl(4, 70%, 75%, 0.7);
}

button.alert:hover {
  background-color: hsl(4, 70%, 75%, 1);
}
</style>
