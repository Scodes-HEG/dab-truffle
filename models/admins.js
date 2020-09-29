import { Notifier } from '~/services/notifier.js';
import { ETHERSCAN_URL } from '~/services/ethereum';
import {LOADER_TURN_ON, LOADER_TURN_OFF} from '~/services/loader.js';
import { IPFS_MANAGER } from '~/services/ipfs';

let model = {
  lists: []
};

let waitingForConfirmation = false;
let lastTransaction = null;
let lastTransactionUrl = null;

export default (context) => () => ({
  async add(address) {
    let contractInstance = context.store.state.admins.contract.instance;
    contractInstance().methods.addAdmin(address).send({
      from: context.store.state.web3.coinbase
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      waitingForConfirmation = true;
      lastTransaction = hash;
      lastTransactionUrl = ETHERSCAN_URL(context.store.state.model.dab.contract.network, '/tx/'+hash);
    }).on('confirmation', (number) => {
      if (waitingForConfirmation) {
        LOADER_TURN_OFF();
        Notifier.info("L'admin a été ajouté !");
        waitingForConfirmation = false;
      }
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de l'ajout de l'admin !", err);
    });
  },
  async removeMe() {
    let address = context.store.state.web3.coinbase;
    let state = context.store.state.admins;
    let contractInstance = state.contract.instance;
    contractInstance().methods.removeAdmin(address).send({
      from: context.store.state.web3.coinbase
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      waitingForConfirmation = true;
      lastTransaction = hash;
      lastTransactionUrl = ETHERSCAN_URL(context.store.state.model.dab.contract.network, '/tx/'+hash);
    }).on('confirmation', (number) => {
      if (waitingForConfirmation) {
        LOADER_TURN_OFF();
        Notifier.info("Vous avez bien été enlevé de la liste des admins !");
        waitingForConfirmation = false;
      }
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de la suppression de l'admin !", err);
    });
  },
  async addMe(email) {
    let address = context.store.state.web3.coinbase;
    let state = context.store.state.admins;
    let contractInstance = state.contract.instance;

    if (await contractInstance().methods.isAdmin(address).call()) {
      Notifier.info("Vous êtes déjà admin, vous ne pouvez pas redemander à le devenir !");
      return false;
    }

    if (!email) {
      Notifier.info("Vous devez préciser votre email");
    }

    let data = state.requests.data;
    data[address] = email;
    let file = await IPFS_MANAGER.add(JSON.stringify(data));
    if (state.requests.hash != file.hash) {
      contractInstance().methods.updateHash(state.requests.hash ? state.requests.hash : '', file.hash).send({
        from: context.store.state.web3.coinbase
      }).on('transactionHash', (hash) => {
        LOADER_TURN_ON();
        waitingForConfirmation = true;
        lastTransaction = hash;
      }).on('confirmation', (number) => {
        if (waitingForConfirmation) {
          LOADER_TURN_OFF();
          Notifier.info("Votre demande est enregistrée !");
          waitingForConfirmation = false;
        }
      }).on('error', (err) => {
        LOADER_TURN_OFF();
        Notifier.error("Une erreur s'est produite lors de votre demande !", err);
      });
    } else {
      Notifier.info("Votre demande est enregistrée !");
    }
  },
  async accept(address) {
    let state = context.store.state.admins;
    let contractInstance = state.contract.instance;
    state = JSON.parse(JSON.stringify(state));
    let data = state.requests.data;

    delete data[address];

    let file = await IPFS_MANAGER.add(JSON.stringify(data));
    contractInstance().methods.addAdminAndUpdateHash(state.requests.hash ? state.requests.hash : '', file.hash, address).send({
      from: context.store.state.web3.coinbase
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      waitingForConfirmation = true;
      lastTransaction = hash;
    }).on('confirmation', (number) => {
      if (waitingForConfirmation) {
        LOADER_TURN_OFF();
        Notifier.info("Votre acceptation est enregistrée !");
        waitingForConfirmation = false;
      }
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de votre demande !", err);
    });
  },
  async refuse(address) {
    let state = context.store.state.admins;
    let contractInstance = state.contract.instance;

    let data = state.requests.data;
    delete data[address];

    let file = await IPFS_MANAGER.add(JSON.stringify(data));
    if (state.requests.hash != file.hash) {
      contractInstance().methods.updateHash(state.requests.hash ? state.requests.hash : '', file.hash).send({
        from: context.store.state.web3.coinbase
      }).on('transactionHash', (hash) => {
        LOADER_TURN_ON();
        waitingForConfirmation = true;
        lastTransaction = hash;
      }).on('confirmation', (number) => {
        if (waitingForConfirmation) {
          LOADER_TURN_OFF();
          Notifier.info("Votre refus est enregistré !");
          waitingForConfirmation = false;
        }
      }).on('error', (err) => {
        LOADER_TURN_OFF();
        Notifier.error("Une erreur s'est produite lors de votre demande !", err);
      });
    } else {
      Notifier.info("Votre refus est enregistrée !");
    }
  },
});
