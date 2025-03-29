// test/PredictionMarket.test.js
describe('Resolution', () => {
    it('Should prevent double resolution', async () => {
      await contract.createPrediction("Prediction Title", "Prediction Description", 10000);
      await contract.resolvePrediction(0, 50000);
      await expect(contract.resolvePrediction(0, 50000))
        .to.be.revertedWith("Already resolved");
    });
  });