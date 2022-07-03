import "dotenv/config";

import { HardhatUserConfig } from "hardhat/types";

import "hardhat-deploy";
import "hardhat-gas-reporter";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
    beneficiary: 1,
    unauthorized: 2,
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
    },
    mainnet: {
      chainId: 56,
      url: "https://bsc-dataseed.binance.org/",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
