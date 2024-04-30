require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    atlas: {
      url: "https://evm-rpc-atlas.planq.network",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
