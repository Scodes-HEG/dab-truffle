<template>
  <section class="dabTable">
    <template v-if="consumed && !model">
      <p v-if="!model">Veuillez patientez, calcul du tableau de consommation en cours...</p>
    </template>
    <template v-if="!consumed || model">
      <p v-if="!model">Chargement...</p>
      <button v-if="model && !show && !readOnly" v-on:click="show = true"><i class="fa fa-eye"></i> Afficher</button>
      <button v-if="model && show && !readOnly" v-on:click="show = false"><i class="fa fa-eye-slash"></i> Cacher&nbsp;&nbsp;</button>
      <table v-if="model && (show || readOnly)">
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
        <tr>
          <th v-for="(pool, index) in pools">{{pool.pool}}</th>
        </tr>
        <tr v-for="(parcelle, index) in parcelles">
          <th v-if="parcelle">{{parcelle.id}}</th>
          <td v-if="parcelle">{{parcelle.surface}}</td>
          <th v-if="parcelle">{{getLocalParcelleDABs(parcelle.uuid)}}</th>
          <td v-for="(pool, index) in pools">
            <template v-if="!consumed">
              {{getLocalParcellePoolDABs(parcelle.uuid, pool.uuid)}}
            </template>
            <template v-if="consumed">
              <strong>{{getConsumedParcellePoolDABs(parcelle.id, pool.pool)}}</strong> / {{getLocalParcellePoolDABs(parcelle.uuid, pool.uuid)}}
            </template>
          </td>
        </tr>
        <tr>
          <th>TOTAL</th>
          <th>{{getLocalSurfaceTotal()}}</th>
          <th>{{getLocalDABs()}}</th>
          <th v-for="(pool, index) in pools">{{getLocalPoolDABs(pool.uuid)}}</th>
        </tr>
      </table>
      <button v-if="model && show && !readOnly" v-on:click="copyIt()"><i class="fa fa-arrow-left"></i> Éditer le tableau de cette proposition</button>
      <button v-if="model && show && !readOnly" v-on:click="selectIt()"><i class="fa fa-arrow-right"></i> Voter pour cette proposition</button>
    </template>
  </section>
</template>

<script>
  import { IPFS_MANAGER } from '~/services/ipfs';
  export default {
    props: {
      ipfs: null,
      readOnly: false,
      consumed: false
    },
    data() {
      return {
        show: false,
        model: null,
        parcelles: [],
        pools: [],
        parcelle_pool_dabs: {},
        accepteds: {}
      }
    },
    async created() {
      if (this.consumed) {
        let accounts = await this.$model.requerants().getList();
        for (let i = 0; i < accounts.length; i++) {
          let account = accounts[i];
          let requests = await this.$model.request_register().getRequests(account.address);
          let accepteds = requests.accepted;
          for (let j = 0; j < accepteds.length; j++) {
            let address = accepteds[j];
            let request = await this.$model.request_register().readRequest(address);
            for(let k = 0; k < request.couples.length; k++) {
              let couple = request.couples[k];
              if (!this.accepteds[couple.parcelle.id]) {
                this.accepteds[couple.parcelle.id] = {};
              }
              if (!this.accepteds[couple.parcelle.id][couple.pool.pool]) {
                this.accepteds[couple.parcelle.id][couple.pool.pool] = {
                  consumedDab: 0
                };
              }
              this.accepteds[couple.parcelle.id][couple.pool.pool].consumedDab += Number(couple.dab);
            }
          }
        }
      }
      let model = await IPFS_MANAGER.read(this.ipfs);
      model = JSON.parse(model);
      this.model = model;
      this.parcelles = model.data.parcelles;
      this.pools = model.data.pools;
      this.parcelle_pool_dabs = model.data.parcelle_pool_dabs;
    },
    methods: {
      getLocalParcellePoolDABs(parcelleUuid, poolUuid) {
        let localParcellePoolDABs = 0;
        if (this.parcelle_pool_dabs && (this.parcelle_pool_dabs != {})) {
          if (this.parcelle_pool_dabs[parcelleUuid]) {
            if (this.parcelle_pool_dabs[parcelleUuid][poolUuid]) {
              localParcellePoolDABs = Number(this.parcelle_pool_dabs[parcelleUuid][poolUuid]);
            }
          }
        }

        return localParcellePoolDABs;
      },
      getConsumedParcellePoolDABs(parcelleId, pool) {
        if (!this.accepteds[parcelleId]) {
          return 0;
        }
        if (!this.accepteds[parcelleId][pool]) {
          return 0;
        }

        return this.accepteds[parcelleId][pool].consumedDab;
      },
      getLocalSurfaceTotal() {
        let localSurfaceTotal = 0;
        this.parcelles.forEach((parcelle) => {
          localSurfaceTotal += Number(parcelle.surface);
        });

        return localSurfaceTotal;
      },
      getLocalDABs() {
        let localTotalDAB = 0;
        if (this.parcelle_pool_dabs && (this.parcelle_pool_dabs != {})) {
          for(let parcelleUuid in this.parcelle_pool_dabs) {
            for(let poolUuid in this.parcelle_pool_dabs[parcelleUuid]) {
              localTotalDAB += Number(this.parcelle_pool_dabs[parcelleUuid][poolUuid]);
            };
          };
        }

        return localTotalDAB;
      },
      getLocalPoolDABs(poolUuid) {
        let localTotalDAB = 0;
        if (this.parcelle_pool_dabs && (this.parcelle_pool_dabs != {})) {
          for(let parcelleUuid in this.parcelle_pool_dabs) {
            if (this.parcelle_pool_dabs[parcelleUuid][poolUuid]) {
              localTotalDAB += Number(this.parcelle_pool_dabs[parcelleUuid][poolUuid]);
            }
          };
        }

        return localTotalDAB;
      },
      getLocalParcelleDABs(parcelleUuid) {
        let localParcellePoolDABs = 0;
        if (this.parcelle_pool_dabs && (this.parcelle_pool_dabs != {})) {
          if (this.parcelle_pool_dabs[parcelleUuid]) {
            for(let poolUuid in this.parcelle_pool_dabs[parcelleUuid]) {
              localParcellePoolDABs += Number(this.parcelle_pool_dabs[parcelleUuid][poolUuid]);
            };
          }
        }

        return localParcellePoolDABs;
      },
      selectIt() {
        this.$emit('select');
      },
      copyIt() {
        this.$emit('copy');
      }
    }
  }
</script>


<style>
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
</style>
