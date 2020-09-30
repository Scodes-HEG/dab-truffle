import { v4 as uuid } from 'uuid';
import md5 from 'md5';
import { IPFS_MANAGER } from '~/services/ipfs';
import { Notifier } from '~/services/notifier.js';
import { ETHERSCAN_URL } from '~/services/ethereum';
import {LOADER_TURN_ON, LOADER_TURN_OFF} from '~/services/loader.js';
import {WEB3_BUS} from '~/services/web3';
import Web3 from 'web3'
import REQUEST_TABLE from '~/build/contracts/RequestRegister';

let waitingForConfirmation = false;

export default (context) => () => ({
  async readRequest(requestAddress) {
    let web3 = new Web3(window.web3.currentProvider);
    let contractInstance = new web3.eth.Contract(REQUEST_TABLE.abi, requestAddress);
    let hash = await contractInstance.methods.hash().call();
    let request = await IPFS_MANAGER.read(hash);

    return JSON.parse(request);
  },
  async acceptRequest(requestAddress) {
    return this.setRequestStatus(requestAddress, 1);
  },
  async refuseRequest(requestAddress) {
    return this.setRequestStatus(requestAddress, 2);
  },
  async pendRequest(requestAddress) {
    return this.setRequestStatus(requestAddress, 0);
  },
  async setRequestStatus(requestAddress, status) {
    return new Promise((resolve, reject) => {
      let web3 = new Web3(window.web3.currentProvider);
      let contractInstance = new web3.eth.Contract(REQUEST_TABLE.abi, requestAddress);
      return contractInstance.methods.setStatus(status).send({
        from: context.store.state.web3.coinbase
      }).on('transactionHash', (hash) => {
        LOADER_TURN_ON();
        waitingForConfirmation = true;
      }).on('confirmation', (number) => {
        if (waitingForConfirmation) {
          LOADER_TURN_OFF();
          Notifier.info("Vous avez bien changé le statut de la requête !");
          waitingForConfirmation = false;
          resolve(true);
        }
      }).on('error', (err) => {
        LOADER_TURN_OFF();
        Notifier.error("Une erreur s'est produite lors de la modificaiton du statut de la requête !", err);
      });
    });
  },
  async getRequests(requerantAddress) {
    let contractInstance = context.store.state.request_register.contract.instance;
    let requests = {
      pending: [],
      accepted: [],
      refused: [],
    };
    try {
      requests = await contractInstance().methods.getRequests(requerantAddress).call();
      requests = {
        pending: requests[0],
        accepted: requests[1],
        refused: requests[2],
      };
    } catch(e) {

    }
    return requests;
  },
  async saveNewRequest(contracts, couples, dabNecessary, info) {
    let requerantAddress = context.store.state.user.info.requerant_account.address;
    let contract = {
      contracts,
      requerantAddress,
      couples,
      dabNecessary,
      info
    };
    let postedMessage = await IPFS_MANAGER.add(contract);
    let hash = postedMessage.hash;
    let registerAddress = context.store.state.request_register.contract.address;

    let contractInstance = context.store.state.request.contract.instance;
    contractInstance().deploy({
      arguments: [registerAddress, requerantAddress, hash]
    })
    .send({
      from: context.store.state.web3.coinbase,
      gas: 1000000,
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      Notifier.info("Votre requête est en cours de dépot... cette opération peut prendre jusqu'à plusieurs minutes.");
      waitingForConfirmation = true;
    }).on('confirmation', (number) => {
      if (waitingForConfirmation) {
        LOADER_TURN_OFF();
        Notifier.info("Votre requête est bien enregistré et déployé sur la blockchain");
        // context.app.router.push('list');
        waitingForConfirmation = false;
      }
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de l'enregistrement de votre requête !", err);
    });
  }
});
