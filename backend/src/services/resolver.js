// backend/src/services/resolver.js
class ResolutionEngine {
    constructor() {
      this.jobs = new Map();
    }
  
    async addPrediction(predictionId, resolveAt) {
      const job = schedule.scheduleJob(resolveAt, async () => {
        const prediction = await db.Prediction.findByPk(predictionId);
        const actualValue = await this.fetchActualValue(prediction);
        await contract.resolvePrediction(predictionId, actualValue);
      });
      this.jobs.set(predictionId, job);
    }
    
    private async fetchActualValue(prediction) {
      return prediction.type === 'price'
        ? await coingecko.getPrice(prediction.asset)
        : await eventOracle.checkOutcome(prediction.eventId);
    }
  }