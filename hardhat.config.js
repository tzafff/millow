require("@nomicfoundation/hardhat-toolbox");

const alchemy_key = "";
const wallet_key = "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/",
      accounts: [wallet_key],
    },
  },
};


