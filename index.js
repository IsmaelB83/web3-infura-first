// Env variables
require('dotenv').config()
// Node imports
const Web3 = require("web3");

// Connection trough infura
const url = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
const web3 = new Web3(new Web3.providers.HttpProvider(url));

// Get eth transaction log
web3.eth.getTransaction("0xaf7bfec2f84b35a58e93ebdf688ba079721b2ac064d7adff520100352206472d")
.then(tx => console.log( tx))
.catch(error => console.log(error));