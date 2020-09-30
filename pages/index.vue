$<template>
  <section class="index">
    <h2>Accueil</h2>
    <article>
      <h3>Infos sur l'application</h3>
      <p>
        Ce prototype tend à être une version complètement partagée de <a href="http://prototype.stadja.net/scodes/mockup/accueil" target="_blank">du mockup</a>.
        <br/>
        <br/>Vous y trouvez donc <strong>les fonctions équivalentes</strong>:
        <ul>
          <li>Les parties "<a href="http://prototype.stadja.net/scodes/mockup/dab/parcelles" target="_blank">Les parcelles</a>", "<a href="http://prototype.stadja.net/scodes/mockup/dab/batiments" target="_blank">Les pools de bâtiments</a>" et "<a href="http://prototype.stadja.net/scodes/mockup/dab/tableau" target="_blank">Édition du tableau initial</a> sont couvertes par la page <strong><nuxt-link to="/dabs/edit">Édition locale</nuxt-link></strong></li>
          <li>Lorsque des propositions sont en cours, la partie "<a href="http://prototype.stadja.net/scodes/mockup/dab/liste" target="_blank">Liste des tableau à valider</a>" est couverte par la page <strong><nuxt-link to="/dabs/proposals">Propositions</nuxt-link></strong></li>
          <li>La partie "<a href="http://prototype.stadja.net/scodes/mockup/dab/valide" target="_blank">Tableau initial validé</a>" est couverte par la page <strong><nuxt-link to="/dabs/table">Tableau initial</nuxt-link></strong></li>
          <li>La partie "<a href="http://prototype.stadja.net/scodes/mockup/requerants/creer" target="_blank">Créer un compte requérant</a>" est couverte par la page <strong><nuxt-link to="/requerants/list">Liste des comptes</nuxt-link></strong></li>
          <li>La partie "<a href="http://prototype.stadja.net/scodes/mockup/contrats/creer" target="_blank">Créer un contrat</a>" est couverte par la page <strong><nuxt-link to="/requerants/new-contract">Nouveau contrat</nuxt-link></strong></li>
        </ul>
      </p>
    </article>
    <article :key="stepReset">
      <h3>Infos techniques</h3>
      <p>
        Toutes les informations partagées de cette application le sont stockées de façons décentralisée.
        <br/>
        <ul>
          <li>Un smart contract central appelé "<strong>Oracle</strong>" est stockée sur la blockchain.
          <br/>Cet Oracle est un registre central permettant de stocker les adresses des autres Smart Contract.
          <br/>Toutes les données de l'Oracle sont déployés dans <a v-bind:href="$store.state.oracle.contract.url" target="_blank">le Smart Contract {{$store.state.oracle.contract.address}}</a></li>
          <li>
            Les Smart Contracts enregistrés dans l'Oracle sont les suivants:
            <ul>
              <li><strong>Admins</strong> <a v-bind:href="$store.state.admins.contract.url" target="_blank">({{$store.state.admins.contract.address}})</a>: permet des gérer la liste des administrateurs du service. <template v-if="admins"><br/>-> Son identifiant dans le registre de l'oracle est "<strong>{{admins.contractName}}</strong>"</template></li>
              <li><strong>Droit à bâtir</strong> <a v-bind:href="$store.state.model.dab.contract.url" target="_blank">({{$store.state.model.dab.contract.address}})</a>: gère les informations sur les droits à bâtir. <template v-if="dab"><br/>-> Son identifiant dans le registre de l'oracle est "<strong>{{dab.contractName}}</strong>"</template></li>
              <li><strong>Requérants</strong> <a v-bind:href="$store.state.model.requerants.contract.url" target="_blank">({{$store.state.model.requerants.contract.address}})</a>: gère la liste des requérants. <template v-if="dab"><br/>-> Son identifiant dans le registre de l'oracle est "<strong>{{requerants.contractName}}</strong>"</template></li>
              <li><strong>Le registre des contrats Requérants/Droits à bâtir</strong> <a v-bind:href="$store.state.requerant_dab_contract_register.contract.url" target="_blank">({{$store.state.requerant_dab_contract_register.contract.address}})</a>: Registre dans lequel est enregistré tous les contrats Requérants/Droits à bâtir. <template v-if="dab"><br/>-> Son identifiant dans le registre de l'oracle est "<strong>{{requerantsContractRegister.contractName}}</strong>"</template></li>
              <li><strong>Le registre des requêtes</strong> <a v-bind:href="$store.state.request_register.contract.url" target="_blank">({{$store.state.request_register.contract.address}})</a>: Registre dans lequel est enregistré toutes les requêtes. <template v-if="dab"><br/>-> Son identifiant dans le registre de l'oracle est "<strong>{{requestRegister.contractName}}</strong>"</template></li>
            </ul>
          </li>
          <li>
            Si vous étudiez les codes des différents smarts contracts, vous verrez qu'ils ne stockent que :
            <ul>
              <li>des adresses sur la blockchain</li>
              <li>des clés représentant des pointeurs vers du contenu externe</li>
            </ul>
            Ce contenu externe est enregistré sous IPFS, un protocol partagé en peer-to-peer.
          </li>
          <li>
            Les informations non partagées sont enregistrées dans le Local Storage de votre navigateur.
          </li>
        </ul>
        Cette application n'est donc qu'un exécutable ne nécessitant aucune base de donnée et pouvant fonctionner de façon local sur n'importe quel serveur ou ordinateur.
      </p>
    </article>
  </section>
</template>

<script>
  import { NETWORKS } from '~/services/constants/ethereum_networks';
  import DAB from '~/build/contracts/Dab';
  import ADMINS from '~/build/contracts/Admins';
  import REQUERANTS from '~/build/contracts/Requerants';
  import REQUERANT_CONTRACT_REGISTER from '~/build/contracts/Contract';
  import REQUEST_REGISTER from '~/build/contracts/RequestRegister';
  import ORACLE from '~/build/contracts/Oracle';
  import {WEB3_BUS} from '~/services/web3';

  export default {
    components: {
    },
    data() {
      return {
        networkName: null,
        admins: null,
        dab: null,
        requerants: null,
        requerantsContractRegister: null,
        stepReset: 1
      }
    },
    mounted() {
      this.networkName = NETWORKS[ORACLE.network];
      this.admins = ADMINS;
      this.dab = DAB;
      this.requerants = REQUERANTS;
      this.requerantsContractRegister = REQUERANT_CONTRACT_REGISTER;
      this.requestRegister = REQUEST_REGISTER;
      WEB3_BUS.$on('model-initialised', function() {
        this.stepReset++;
      }.bind(this));
    }
  }
</script>
<style></style>
