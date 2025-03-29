require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // Local development network
    hardhat: {},

    // Monad network configuration
    monad: {
      url: process.env.MONAD_RPC_URL || "http://localhost:8545", // Monad RPC endpoint
      chainId: 10143, // Replace with Monad's actual chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      //accounts: [process.env.DEPLOYER_KEY],
      gas: 'auto',
      gasPrice: 'auto',
    }
  }
};
