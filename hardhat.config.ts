require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");

const fs = require("fs");

const config = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    avalancheTest: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 225000000000,
      accounts: { mnemonic: config }
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    }
  },
  etherscan: {
    apiKey: "PNK498JW4IC4WKJDVC1EPFM7QIJ257IUBP"
  }
};

