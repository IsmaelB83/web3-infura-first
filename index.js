// Env variables
require('dotenv').config()
// Node imports
const Web3 = require('web3');
const Web3Utils = require('web3-utils');
const EthereumTx = require('ethereumjs-tx').Transaction
const prompt = require('prompt-sync')({ sigint: true });
const Common = require('ethereumjs-common').default;
const HDWalletProvider = require("@truffle/hdwallet-provider");

// Constants
const { INFURA_API_KEY, INFURA_SECRET, WALLET_MNEMONIC } = process.env;
const { SENDING_ADDRESS, SENDING_PKEY, RECEIVING_ADDRESS } = process.env;
const SENDING_PKEY_HX = Buffer.from(SENDING_PKEY, 'hex');
const INFURA_URL = `https://:${INFURA_SECRET}@rinkeby.infura.io/v3/${INFURA_API_KEY}`;
const GANACHE_URL = `http://127.0.0.1:7545`;

// Select connection type
let input, chain, web3;
do {
    console.clear();
    console.log(`TYPE OF CONNECTION:
                    0) GANACHE <${GANACHE_URL}>
                    1) INFURA <${INFURA_URL}>
                `);
    input = prompt('select your option... ');
    console.log('');
} while (input !== '0' && input !== '1');

// Connection to network
switch (input) {
    case '0':
         web3 = new Web3(GANACHE_URL);
        break;
    case '1':
        chain = new Common('rinkeby', 'istanbul');
        const provider = new HDWalletProvider(WALLET_MNEMONIC, INFURA_URL);
        web3 = new Web3(provider);
        break;
}

// Check balances of the accounts
web3.eth.getBalance(SENDING_ADDRESS).then(bal => console.log(`Sender ${SENDING_ADDRESS} balance is ${Web3Utils.fromWei(bal)}`))
web3.eth.getBalance(RECEIVING_ADDRESS).then(bal => console.log(`Receiver ${RECEIVING_ADDRESS} balance is ${Web3Utils.fromWei(bal)}`))

// Create transaction between previous addresses 
async function cretateTransaction() {

    // Value to transfer
    const TRANSFER_VALUE = Web3Utils.toWei('0.01', 'ether');
    // Current nonce of sender address
    const nonce = await web3.eth.getTransactionCount(SENDING_ADDRESS);

    // Check sender balance 
    const balance = await web3.eth.getBalance(SENDING_ADDRESS);
    if (parseFloat(balance) < parseFloat(TRANSFER_VALUE))
        return console.log(`\nError - Funds available ${Web3Utils.fromWei(balance)} not enough to transfer ${Web3Utils.fromWei(TRANSFER_VALUE)}`)
    
    // New raw transaction
    const rawTx = {
        from: Web3Utils.toHex(SENDING_ADDRESS),
        to: Web3Utils.toHex(RECEIVING_ADDRESS),
        nonce: Web3Utils.toHex(nonce),
        gasPrice: Web3Utils.toHex(web3.utils.toWei( '1.6' , 'gwei' )),
        gasLimit: Web3Utils.toHex('30000'),
        value: Web3Utils.toHex(TRANSFER_VALUE),
        data: web3.utils.toHex('Hello World!'),
    }

    // Sign the transaction
    const transaction = new EthereumTx(rawTx, { common : chain });
    transaction.sign(SENDING_PKEY_HX);

    // Send the transaction
    web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString( 'hex' ) )
    .then(result => console.log(result))
    .catch(error => console.log(error));   
}

// Create a transaction 
cretateTransaction();