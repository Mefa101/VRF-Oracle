const { ethers } = require('ethers');
const crypto = require('crypto');

// Configuration: Set your Infura API key and the account private key
const PRIVATE_KEY = '';
const CONTRACT_ADDRESS = '0xD3f0Aa4a588903dabF238E7Bf4862A7d04b35b64';

const provider = new ethers.JsonRpcProvider(`https://evm-rpc-atlas.planq.network`);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Import ABI from an external file or define it here
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "commitRandomNumber",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
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
			}
		],
		"name": "RandomNumberRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "randomNumber",
				"type": "uint256"
			}
		],
		"name": "RandomNumberRevealed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "randomNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nonce",
				"type": "uint256"
			}
		],
		"name": "revealRandomNumber",
		"outputs": [],
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
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "commitments",
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
				"internalType": "uint256",
				"name": "randomNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nonce",
				"type": "uint256"
			}
		],
		"name": "getCommitHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
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
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "numberRevealed",
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

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

function generateSecureRandomNumber() {
    const buffer = crypto.randomBytes(32);
    return BigInt('0x' + buffer.toString('hex'));
}

function createSha256Hash(data) {
    const hashFunction = crypto.createHash('sha256');
    hashFunction.update(data);
    return '0x' + hashFunction.digest('hex');
}

function convertBigIntToHexString(bigIntValue) {
    return '0x' + bigIntValue.toString(16).padStart(64, '0');
}

async function commitRandomNumber() {
    const randomNumber = generateSecureRandomNumber();
    const nonce = generateSecureRandomNumber();
    const dataToHash = convertBigIntToHexString(randomNumber) + convertBigIntToHexString(nonce).slice(2); // Remove '0x' from the second part
    const hash = createSha256Hash(dataToHash);

    try {
        const tx = await contract.commitRandomNumber(hash);
        const receipt = await tx.wait();
        console.log(`Commitment made with hash: ${hash}`);
        return { randomNumber, nonce, hash };
    } catch (error) {
        console.error('Error committing random number:', error);
    }
}

async function revealRandomNumber(randomNumber, nonce) {
    try {
        const tx = await contract.revealRandomNumber(randomNumber.toString(), nonce.toString());
        const receipt = await tx.wait();
        console.log('Random number revealed:', receipt);
    } catch (error) {
        console.error('Error revealing random number:', error);
    }
}

async function main() {
    const { randomNumber, nonce } = await commitRandomNumber();
    setTimeout(() => {
        revealRandomNumber(randomNumber, nonce);
    }, 60000); // Wait 60 seconds before revealing
}

main();
