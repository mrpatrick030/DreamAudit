require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

const { SOMNIA_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    somniaTestnet: {
      url: "https://dream-rpc.somnia.network",
      accounts: SOMNIA_PRIVATE_KEY ? [SOMNIA_PRIVATE_KEY] : [],
      chainid:50312
    },
  },
};
