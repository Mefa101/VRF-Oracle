# Oracle Contract


https://github.com/Mefa101/VRF-Oracle/assets/141573555/b31b6772-ca87-4f91-8c95-17379df382da


## Overview

The Oracle contract serves as a decentralized data feed system for blockchain applications, particularly those running on the Planq network. This smart contract allows users to request and retrieve updated prices and random numbers, securely and reliably, without relying on external centralized sources.

## Problem Solved

Blockchain applications often need access to real-world data, but the blockchain by its very nature is isolated and cannot access this data directly. The Oracle contract addresses this fundamental problem by allowing smart contracts to retrieve external data in a decentralized manner. This is crucial for applications such as dynamic pricing in decentralized finance (DeFi), games, and various other use cases where external data is necessary to execute business logic.

### Features

- **Price Updates**: Allows updating and retrieving prices for different symbols, ensuring that decentralized applications can get the latest market data.
- **Random Number Generation**: Provides a way to request and retrieve random numbers which can be used for various purposes such as in decentralized gaming or lottery systems.
- **Ownership Management**: Ensures that only the owner of the contract can update prices, preserving data integrity and security.
- **Event Emission**: Emits events whenever prices or random numbers are updated, enabling applications to react to changes in data asynchronously.

### How It Works

1. **Ownership**: The contract is owned by the deployer, who has exclusive rights to update the prices.
2. **Price ID Generation**: A unique identifier for each symbol's price is generated using a hash function, ensuring that each symbol's price is stored and retrieved securely.
3. **Price Updating and Retrieval**:
    - The owner calls `updatePrice`, passing a symbol and its price.
    - The price is stored in the contract, and an event is emitted.
    - Anyone can call `getPrice` to retrieve the latest price for a given symbol.
4. **Random Number Requests and Retrieval**:
    - Any user can request a random number, which triggers the generation and storage of a random number linked to a request ID.
    - The random number can be retrieved using the request ID after it is available.

## Using the Oracle with a Consumer Contract

### Consumer Contract Overview

The Consumer contract is designed to interact with the Oracle contract to fetch prices and random numbers. It demonstrates how to integrate Oracle functionalities into other contracts seamlessly.

### Key Functionalities

- **Request and Retrieve Price**: The Consumer contract requests a price ID for a given symbol from the Oracle and then retrieves the price associated with that ID.
- **Request and Retrieve Random Number**: It shows how to request a random number, which is generated and stored by the Oracle

### Deployed Contract
Deployed Contract Oracle Address: [0x4be96D5Ff14A4DD209505A783dd45DC8283f9916](https://explorer.planq.network/address/0x4be96D5Ff14A4DD209505A783dd45DC8283f9916?tab=contract)

Deployed Contract Consumer Address: [0x787BD599b7A7e3edd44f8eD6c352d68CCdC8aAd2](https://explorer.planq.network/address/0x787BD599b7A7e3edd44f8eD6c352d68CCdC8aAd2?tab=contract)

### Price ID 
##Planq Atlas network
Planq : 0x210f9a73a8d257cc3591528c146a1c6d779ab6377155affc93d03d9325c2ae28

Bitcoin : 0x7a653fd2048f1ad54cc6d88a78236329a7f6d3f5f9ab3f6a18902cfc1958c74e

ethereum : 0x440fed1296b73811a6cf4227d2ac47ffb7bcd3cbcff742f03eccecbae829ea86
