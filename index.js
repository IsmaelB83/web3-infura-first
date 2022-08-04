// Env variables
require('dotenv').config()
// Node imports
const Web3 = require("web3");
const Web3Utils = require("web3-utils");

// Connection trough infura
const url = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(url));

// Constants
const MAINNET_ACCOUNT = '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf'
const ROPSTEN_TXID = '0xdaa2efddc058a5071e93fc7f14aeebb25f423dd7a21500e60515c28afb070761';
const ETH_USD_RATE = 1669.06

// Get eth account balance (Kraken address)
web3.eth.getBalance(MAINNET_ACCOUNT)
.then(bal => {
    const ethBal = Web3Utils.fromWei(bal)
    const dollarUSLocale = Intl.NumberFormat('es-ES');
    const balUSD = ethBal * ETH_USD_RATE;

    console.log(`MAINNET ACCOUNT BALANCE ${MAINNET_ACCOUNT} -->
                    Balance in wei ${bal}
                    Balance in eth ${ethBal}
                    Balance in $ ${dollarUSLocale.format(balUSD)}
                `);
})
.catch(error => console.log(error));

// Connection trough infura to Ropsten
const url2 = `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`;
const web3_2 = new Web3(new Web3.providers.HttpProvider(url2));

// Get eth account balance (Kraken address)
web3_2.eth.getTransaction(ROPSTEN_TXID)
.then(tx => {
    console.log(`ROPSTEN TRANSACTION DETAIL (tx ${ROPSTEN_TXID})
                    From: ${tx.from}
                    To: ${tx.to}
                    Amount (eth): ${Web3Utils.fromWei(tx.value)}
                `);
})
.catch(error => console.log(error));