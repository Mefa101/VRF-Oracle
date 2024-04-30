// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOracle {
    function requestRandomNumber() external returns (bytes32);
    function getRandomNumber(bytes32 requestId) external view returns (uint256);
    function getPriceId(string calldata symbol) external returns (bytes32);
    function getPrice(bytes32 priceId) external view returns (uint256);
}

contract Consumer {
    IOracle public oracle;
    mapping(bytes32 => uint256) public retrievedPrices;
    mapping(bytes32 => uint256) public retrievedRandomNumbers;

    event PriceDataRequested(bytes32 indexed requestId, string symbol);
    event PriceDataRetrieved(bytes32 indexed requestId, uint256 price);
    event RandomNumberDataRequested(bytes32 indexed requestId);
    event RandomNumberDataRetrieved(bytes32 indexed requestId, uint256 randomNumber);

    constructor(address oracleAddress) {
        oracle = IOracle(oracleAddress);
    }

    function requestAndRetrievePrice(string memory symbol) public returns (bytes32 requestId) {
        requestId = oracle.getPriceId(symbol);
        uint256 price = oracle.getPrice(requestId);
        retrievedPrices[requestId] = price;
        emit PriceDataRequested(requestId, symbol);
        emit PriceDataRetrieved(requestId, price);
        return requestId;
    }

    function requestAndRetrieveRandomNumber() public returns (bytes32 requestId) {
        requestId = oracle.requestRandomNumber();
        emit RandomNumberDataRequested(requestId);
        // Do not retrieve the random number here if it is not immediately available
        return requestId;
    }

    function retrieveRandomNumber(bytes32 requestId) public returns (uint256 randomNumber) {
        randomNumber = oracle.getRandomNumber(requestId);
        retrievedRandomNumbers[requestId] = randomNumber;
        emit RandomNumberDataRetrieved(requestId, randomNumber);
        return randomNumber;
    }
}
