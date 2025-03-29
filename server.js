const express = require("express");
const { Pool } = require("pg");
const Web3 = require("web3");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });



const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: String (process.env.DB_NAME),
  password: String (process.env.DB_PASSWORD),
  port: process.env.DB_PORT,
  //- Database connection pooling
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,

});

// Web3 connection
const web3 = new Web3(process.env.MONAD_RPC_URL);

app.get("/", (req, res) => {
  res.send("Crypto Price Prediction Platform");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);

  
});

const axios = require("axios");

async function getCryptoPrice(cryptoId) {
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`);
  return response.data[cryptoId].usd;
}
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("Error connecting to the database:", err);
    } else {
      console.log("Database connection successful:", res.rows[0]);
    }
  });

  // server.js
app.post('/api/login', async (req, res) => {
  const { walletAddress, signature } = req.body;
  
  // Verify signature using web3
  const signer = web3.eth.accounts.recover('Login to Prediction Platform', signature);
  if (signer.toLowerCase() === walletAddress.toLowerCase()) {
    // Save/update user in PostgreSQL
    await pool.query(`
      INSERT INTO users (wallet_address, username) 
      VALUES ($1, $2)
      ON CONFLICT (wallet_address) DO NOTHING`,
      [walletAddress, `user_${walletAddress.slice(0, 6)}`]
    );
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid signature" });
  }
});

// server.js
app.post('/api/predictions', async (req, res) => {
  const { walletAddress, cryptocurrency, predictedPrice } = req.body;
  
  // 1. Get user ID
  const userRes = await pool.query(
    'SELECT id FROM users WHERE wallet_address = $1', 
    [walletAddress]
  );
  
  // 2. Save prediction
  await pool.query(
    `INSERT INTO predictions 
     (user_id, cryptocurrency, predicted_price) 
     VALUES ($1, $2, $3)`,
    [userRes.rows[0].id, cryptocurrency, predictedPrice]
  );
  
  res.json({ success: true });
});

// server.js
const contract = new web3.eth.Contract(abi, contractAddress);

contract.events.PredictionResolved()
  .on('data', async (event) => {
    await pool.query(
      `UPDATE predictions 
       SET actual_price = $1, resolved = true 
       WHERE id = $2`,
      [event.returnValues.actualPrice, event.returnValues.id]
    );
  });

  // Submit prediction (web3 integration)
app.post('/api/predict', async (req, res) => {
  const { walletAddress, crypto, price } = req.body;
  
  // 1. Interact with contract
  const contract = new web3.eth.Contract(abi, contractAddress);
  await contract.methods.submitPrediction(crypto, price)
    .send({ from: walletAddress });
  
  // 2. Save to PostgreSQL
  await pool.query(
    `INSERT INTO predictions (user_id, cryptocurrency, predicted_price)
     VALUES ((SELECT id FROM users WHERE wallet_address = $1), $2, $3)`,
    [walletAddress, crypto, price]
  );
  
  res.json({ success: true });
});


//- Database connection pooling

