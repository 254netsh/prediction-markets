// test/PredictionMarket.js
const { expect } = require("chai");

describe("PredictionMarket", () => {
  let contract, priceFeed;

  beforeEach(async () => {
    const PriceFeed = await ethers.getContractFactory("MockAggregator");
    priceFeed = await PriceFeed.deploy(8, 300000000000); // $30,000
    const Contract = await ethers.getContractFactory("PredictionMarket");
    contract = await Contract.deploy(priceFeed.address);
  });

  it("Should submit and resolve predictions", async () => {
    await contract.submitPrediction("BTC", 31000, 3600);
    await contract.resolvePrediction(0, 29500);
    
    const pred = await contract.predictions(0);
    expect(pred.resolved).to.be.true;
    expect(pred.actualPrice).to.equal(29500);
  });
});