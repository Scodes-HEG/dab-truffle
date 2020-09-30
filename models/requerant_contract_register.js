import { v4 as uuid } from 'uuid';
import md5 from 'md5';
import { IPFS_MANAGER } from '~/services/ipfs';
import { Notifier } from '~/services/notifier.js';
import { ETHERSCAN_URL } from '~/services/ethereum';
import {LOADER_TURN_ON, LOADER_TURN_OFF} from '~/services/loader.js';
import {WEB3_BUS} from '~/services/web3';
import Web3 from 'web3'

let waitingForConfirmation = false;

export default (context) => () => ({
  async getContracts(requerantAddress) {
    let contractRegisterInstance = context.store.state.requerant_dab_contract_register.contract.instance;
    let contracts = await contractRegisterInstance().methods.getContracts(requerantAddress).call();

    let contractInstance = context.store.state.requerant_dab_contract.contract.instance;
    let getContracts = [];
    let instanceToBeCalled = contractInstance();
    for(let i =0; i < contracts.length; i++) {
      let contract = {
        address: contracts[i],
        url: ETHERSCAN_URL(context.store.state.requerant_dab_contract_register.contract.network, '/address/'+contracts[i])
      };
      instanceToBeCalled.options.address = contract.address;
      let test = await instanceToBeCalled.methods.is_obsolet().call();
      if (!(await instanceToBeCalled.methods.is_obsolet().call())) {
        let hash = await instanceToBeCalled.methods.hash().call();
        contract.hash = hash;
        getContracts.push(contract);
      }
    }

    return getContracts;
    },
  async saveNewContract(parcelle, pool, info) {
    let requerantAddress = context.store.state.user.info.requerant_account.address;
    let contract = {
      requerantAddress,
      parcelle,
      pool,
      info
    };

    let postedMessage = await IPFS_MANAGER.add(contract);
    let hash = postedMessage.hash;
    let registerAddress = context.store.state.requerant_dab_contract_register.contract.address;

    let contractInstance = context.store.state.requerant_dab_contract.contract.instance;
    contractInstance().deploy({
      arguments: [registerAddress, requerantAddress, hash]
    })
    .send({
      from: context.store.state.web3.coinbase,
      gas: 1000000,
    }).on('transactionHash', (hash) => {
      LOADER_TURN_ON();
      Notifier.info("Votre contract est en cours de déploiement... cette opération peut prendre jusqu'à plusieurs minutes.");
      waitingForConfirmation = true;
    }).on('confirmation', (number) => {
      if (waitingForConfirmation) {
        LOADER_TURN_OFF();
        Notifier.info("Votre contract est bien enregistré et déployé sur la blockchain");
        context.app.router.push('list');
        waitingForConfirmation = false;
      }
    }).on('error', (err) => {
      LOADER_TURN_OFF();
      Notifier.error("Une erreur s'est produite lors de l'enregistrement de votre contrat !", err);
    });
  }
});
