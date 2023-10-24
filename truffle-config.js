const env = require('dotenv').config()

const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = (env && env.parsed) ? env.parsed.ACCOUNT_MENMONIC : '';

module.exports = {

  networks: {
    development: {
      host: env.parsed.LOCAL_BLOCKCHAIN_HOST ? env.parsed.LOCAL_BLOCKCHAIN_HOST : '0.0.0.0',
      port: env.parsed.LOCAL_BLOCKCHAIN_PORT ? env.parsed.LOCAL_BLOCKCHAIN_PORT : '7545',
      network_id: env.parsed.LOCAL_BLOCKCHAIN_ID ? env.parsed.LOCAL_BLOCKCHAIN_ID : '5777',
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/"+env.parsed.INFURA_API_KEY)
      },
      network_id: 3
    },
    sepolia: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://sepolia.infura.io/v3/"+env.parsed.INFURA_API_KEY);
      },
      network_id: 11155111
    }
  }

};
