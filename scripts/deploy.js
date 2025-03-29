const hre = require("hardhat");

// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Chainlink Price Feed Address (Ethereum Mainnet example)
  const priceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";

  // 1. Get contract factory
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  
  // 2. Deploy with constructor arguments
  const contract = await PredictionMarket.deploy(
    priceFeedAddress,  // Constructor argument
    { gasLimit: 5000000 } // Optional overrides
  );

  console.log("Contract deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });