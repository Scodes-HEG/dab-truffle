const env = require('dotenv').config()

const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = env.parsed.ACCOUNT_MENMONIC;

module.exports = {

  networks: {
    development: {
      host: "0.0.0.0",
      port: 7545,
      network_id: "5777"
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/"+env.parsed.INFURA_API_KEY)
      },
      network_id: 3
    }
  }

};
