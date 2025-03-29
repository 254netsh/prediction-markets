// create priceResolver.js
import cron from 'node-cron';
import axios from 'axios';


cron.schedule('*/5 * * * *', async () => { // Every 5 minutes
  const unresolved = await pool.query(
    `SELECT * FROM predictions WHERE actual_price IS NULL`
  );
  
  for (const prediction of unresolved.rows) {
    const currentPrice = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${prediction.cryptocurrency}&vs_currencies=usd`
    );
    
    await pool.query(
      `UPDATE predictions SET actual_price = $1 WHERE id = $2`,
      [currentPrice.data[prediction.cryptocurrency].usd, prediction.id]
    );
  }
});


// priceResolver.js - Cron job
cron.schedule('0 * * * *', async () => { // Hourly
  // 1. Get unresolved predictions
  const unresolved = await pool.query(`
    SELECT * FROM predictions 
    WHERE resolved = false 
      AND created_at + timeframe <= NOW()
  `);

  // 2. Resolve each prediction
  for (const pred of unresolved.rows) {
    const currentPrice = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${pred.crypto}&vs_currencies=usd`
    );
    
    // Update DB
    await pool.query(
      `UPDATE predictions 
       SET actual_price = $1, resolved = true 
       WHERE id = $2`,
      [currentPrice.data[pred.crypto].usd, pred.id]
    );

    // Update blockchain
    const contract = new web3.eth.Contract(abi, contractAddress);
    await contract.methods.resolvePrediction(pred.id, currentPrice.data[pred.crypto].usd)
      .send({ from: adminWallet });
  }
});
