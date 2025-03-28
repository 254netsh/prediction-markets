const hre = require("hardhat");

async function main() {
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy("CHAINLINK_PRICE_FEED_ADDRESS");

  await predictionMarket.deployed();
  console.log("PredictionMarket deployed to:", predictionMarket.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});