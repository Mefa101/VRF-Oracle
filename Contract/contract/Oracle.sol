// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Oracle {
    address public owner;
    mapping(string => bytes32) public symbolToPriceId;
    mapping(bytes32 => uint256) public prices;
    mapping(bytes32 => bool) public priceUpdated;

    // VRF related mappings
    mapping(bytes32 => uint256) public randomNumbers;
    mapping(bytes32 => bool) public randomNumberAvailable;

    event PriceUpdated(bytes32 indexed priceId, uint256 price);
    event RandomNumberRequested(bytes32 indexed requestId);
    event RandomNumberAvailable(bytes32 indexed requestId, uint256 randomNumber);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function getPriceId(string memory symbol) public returns (bytes32) {
        if (symbolToPriceId[symbol] == bytes32(0)) {
            bytes32 priceId = keccak256(abi.encodePacked(symbol, block.timestamp));
            symbolToPriceId[symbol] = priceId;
        }
        return symbolToPriceId[symbol];
    }

    function updatePrice(string memory symbol, uint256 price) public onlyOwner {
        bytes32 priceId = getPriceId(symbol);
        prices[priceId] = price;
        priceUpdated[priceId] = true;
        emit PriceUpdated(priceId, price);
    }

    function getPrice(bytes32 priceId) public view returns (uint256) {
        require(priceUpdated[priceId], "Price not updated yet");
        return prices[priceId];
    }

    function requestRandomNumber() public returns (bytes32 requestId) {
        requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        uint256 randomNumber = uint256(requestId); // Simplified random number generation for example
        randomNumbers[requestId] = randomNumber;
        randomNumberAvailable[requestId] = true;
        emit RandomNumberRequested(requestId);
        emit RandomNumberAvailable(requestId, randomNumber);
        return requestId;
    }

    function getRandomNumber(bytes32 requestId) public view returns (uint256) {
        require(randomNumberAvailable[requestId], "Random number not available");
        return randomNumbers[requestId];
    }
}
