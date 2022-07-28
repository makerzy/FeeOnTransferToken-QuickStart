import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
dotenv.config();
const {
  ETHERSCAN_API_KEY,
  MAINNET_RPC_URL,
  PRIVATE_KEY,
  RINKEBY_RPC_URL,
  MNEMONIC,
  MAIN_WALLET,
} = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
        hardfork: "istanbul",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 21,
    gasPriceApi: `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${ETHERSCAN_API_KEY}`,
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [MAIN_WALLET],
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: [MAIN_WALLET],
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: ETHERSCAN_API_KEY,
      mainnet: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "rinkeby",
        chainId: 4,
        urls: {
          apiURL: "https://api-rinkeby.etherscan.io/api",
          browserURL: "https://rinkeby.etherscan.io",
        },
      },
      {
        network: "mainnet",
        chainId: 1,
        urls: {
          apiURL: "https://api.etherscan.io/api",
          browserURL: "https://etherscan.io",
        },
      },
    ],
  },

  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [],
  },
};
