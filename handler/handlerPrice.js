// Import necessary modules
const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Environment variables
const PRIVATE_KEY = ''; // Ensure your private key is stored in .env file for security
const CONTRACT_ADDRESS = '0x4be96D5Ff14A4DD209505A783dd45DC8283f9916';

// Initialize ethers with an HTTP Provider (or use WebSocket for subscriptions)
const provider = new ethers.JsonRpcProvider(`https://evm-rpc-atlas.planq.network`);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			}
		],
		"name": "getPriceId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "priceId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "PriceUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "randomNumber",
				"type": "uint256"
			}
		],
		"name": "RandomNumberAvailable",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"name": "RandomNumberRequested",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "requestRandomNumber",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "updatePrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "priceId",
				"type": "bytes32"
			}
		],
		"name": "getPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"name": "getRandomNumber",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "prices",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "priceUpdated",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "randomNumberAvailable",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "randomNumbers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "symbolToPriceId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// Function to fetch prices from CoinGecko
async function fetchPrices(symbols) {
    const ids = symbols.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch prices:', error);
        return {};
    }
}

// Function to update price on the smart contract
async function updatePrice(symbol, price) {
    try {
        console.log(`Received price for ${symbol}: $${price}`);
        const priceInWei = ethers.parseUnits(price.toString(), 'ether');
        console.log(`Converted price for ${symbol} to Wei: ${priceInWei.toString()}`);

        // Fetch the price ID using the symbol from the smart contract
        const priceId = await contract.getPriceId(symbol);
        console.log(`Price ID for ${symbol}: ${priceId}`);

        // Update the price using the fetched price ID
		const ticker = 'planq'
        const txResponse = await contract.updatePrice(ticker, priceInWei);
		console.log(priceId)
        const receipt = await txResponse.wait();
        console.log(`Price for ${symbol} updated on-chain: Transaction hash ${receipt.transactionHash}`);
    } catch (error) {
        console.error(`Error updating price for ${symbol}:`, error);
    }
}

// Function to periodically fetch and update prices
async function periodicallyUpdatePrices() {
    const symbols = ['planq']; // Example symbols
    const pricesData = await fetchPrices(symbols);
    for (const symbol of symbols) {
        const price = pricesData[symbol]?.usd;
        if (price) {
            await updatePrice(symbol, price);
        } else {
            console.error(`No price data available for ${symbol}`);
        }
    }
}

// Schedule price updates every 15 minutes
setInterval(periodicallyUpdatePrices, 15 * 60 * 1000); // 15 minutes interval
periodicallyUpdatePrices(); // Initial call to start the price updates
