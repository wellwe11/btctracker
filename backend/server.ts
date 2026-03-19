import express from "express";
import cors from "cors";
import { DatabaseSync } from "node:sqlite";
import { z } from "zod";

// The backend is going to fetch data for around 20-30 different coins, and update them each 5 seconds.
// It is going to divide coins with custom API
// Once a coin is selected for preview, it will pause fetching other coins, and only update current coin
// If coin is de-selected, code will return to fetching code for all coins every 5 seconds.

// A coins object will look like so:
// If no coin is selected:
// User can toggle between time-periods, so, 24 hour, 48 hour, 1 week, 2 week, 1 month, 3 month, 6 month.
// It will fetch the history of coin for specified time-period
// Object will look like:
/**
 * {
 * coin: "name",
 * histoy:
 *  [
 *    {
 *      timeStamp: 123125154,
 *      value: 1241632
 *     },
 * *    {
 *      timeStamp: 1234634,
 *      value: 122352
 *     }...
 *   ]
 * }
 */

const app = express();
const PORT = 5001;

const db = new DatabaseSync("./btc.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS prices (
    symbol TEXT PRIMARY KEY,
    price REAL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

const PriceSchema = z.object({
  symbol: z.string(),
  price: z.string(),
});

app.get("/api/update-price", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
    );
    const rawData = await response.json();

    const validated = PriceSchema.parse(rawData);
    const btcPrice = parseFloat(validated.price);

    const insert = db.prepare(`
      INSERT INTO prices (symbol, price, updatedAt) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(symbol) DO UPDATE SET 
        price = excluded.price, 
        updatedAt = CURRENT_TIMESTAMP
    `);

    insert.run("BTC", btcPrice);

    console.log(`[API] Updated BTC: $${btcPrice}`);
    res.json({ symbol: "BTC", price: btcPrice, status: "success" });
  } catch (error) {
    console.error("[API] Sync Error:", error);
    res.status(500).json({ error: "Failed to sync price" });
  }
});

app.get("/", (req, res) => {
  res.send("BTC Tracker API is running! Try /api/update-price");
});

app.get("/api/price", (req, res) => {
  const query = db.prepare("SELECT * FROM prices WHERE symbol = ?");
  const row = query.get("BTC");
  res.json(row || { error: "No data found" });
});

app.listen(PORT, () => {
  console.log(`Backend live at http://localhost:${PORT}`);
});
