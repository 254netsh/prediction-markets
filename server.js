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