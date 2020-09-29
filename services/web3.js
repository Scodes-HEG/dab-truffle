import Web3 from 'web3'
// import {state} from '~/store/web3'
// import { mapState } from 'vuex'
import Vuex from 'vuex'
import Vue from 'vue'
import { Notifier } from '~/services/notifier.js';

// *
//  * 1. Check for injected web3 (mist/metamask)
//  * 2. If metamask/mist create a new web3 instance and pass on result
//  * 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
//  * 4. Get user account from metamask
//  * 5. Get user balance
//  *
let getWeb3 = function() {
    return new Promise(async function(resolve, reject) {
        // Check for injected web3 (mist/metamask)
        var web3js = window.web3
        await ethereum.enable();

        Notifier.log('WEB3_SERVICE: Check for injected web3', web3js);
        if (typeof web3js !== 'undefined') {
            Notifier.log('WEB3_SERVICE: Current provider', web3js.currentProvider);
            var web3 = new Web3(web3js.currentProvider)
            web3.eth.net.isListening()
                .then((isListening) => {
                    Notifier.log('WEB3_SERVICE: isListening: ' + isListening);
                    resolve({
                        injectedWeb3: isListening,
                        web3() {
                            return web3
                        }
                    })
                })
                .catch((err) => {
                    Notifier.error('WEB3_SERVICE: isListening error', err);
                });
        } else {
            // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
            reject(new Error('Unable to connect to Metamask'))
        }
    })
    .then(result => {
        return new Promise(function(resolve, reject) {
            // Retrieve network ID
            Notifier.log('WEB3_SERVICE: Retrieve network ID');
            result.web3().eth.net.getId().then((networkId) => {
                Notifier.log(networkId);
                if (!networkId) {
                    // If we can't find a networkId keep result the same and reject the promise
                    reject(new Error('Unable to retrieve network ID'))
                } else {
                    // Assign the networkId property to our result and resolve promise
                    result = Object.assign({}, result, {
                        networkId
                    })
                    resolve(result)
                }
            })
        })
    })
    .then(result => {
        return new Promise(function(resolve, reject) {
            // Retrieve coinbase
            Notifier.log('WEB3_SERVICE: Retrieve coinbase');
            result.web3().eth.getCoinbase((err, coinbase) => {
                if (err) {
                    reject(new Error('Unable to retrieve coinbase'))
                } else {
                    result = Object.assign({}, result, {
                        coinbase
                    })
                    Notifier.log(result);
                    resolve(result)
                }
            })
        })
    })
    .then(result => {
        return new Promise(function(resolve, reject) {

            if (!result.coinbase) {
                return reject(new Error('WEB3_SERVICE: coinbase null, are you connected ?'))
            }

            // Retrieve balance for coinbase
            Notifier.log('WEB3_SERVICE: Retrieve balance for coinbase');
            result.web3().eth.getBalance(result.coinbase, (err, balance) => {
                if (err) {
                    reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
                } else {
                    result = Object.assign({}, result, {
                        balance
                    })
                    Notifier.log(result);
                    resolve(result)
                }
            })
        })
    })
};

let localStore;

let pollWeb3 = function(currentStore) {
    Notifier.log('WEB3_SERVICE: launch polling');
    localStore = currentStore;

    let web3 = window.web3

    setInterval(function() {
        if (web3 && localStore.state.web3.web3Instance()) {
            if (web3.eth.coinbase !== localStore.state.web3.coinbase) {
                let newCoinbase = web3.eth.coinbase
                web3.eth.getBalance(web3.eth.coinbase, function(err, newBalance) {
                    if (err) {
                        Notifier.error(err)
                    } else {
                        localStore.dispatch('web3/pollWeb3', {
                            coinbase: newCoinbase,
                            balance: parseInt(newBalance, 10)
                        })
                    }
                })
            } else {
                web3.eth.getBalance(localStore.state.web3.coinbase, (err, polledBalance) => {
                    if (err) {
                        Notifier.error(err)
                    } else if (parseInt(polledBalance, 10) !== localStore.state.web3.balance) {
                        localStore.dispatch('web3/pollWeb3', {
                            coinbase: localStore.state.web3.coinbase,
                            balance: polledBalance
                        })
                    }
                })
            }
        }
    }, 500)
}

export const WEB3_GET = getWeb3;
export const WEB3_POLL = pollWeb3;

export const WEB3_BUS = new Vue();
