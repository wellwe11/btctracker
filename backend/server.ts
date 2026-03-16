import express from "express";
import cors from "cors";
import { DatabaseSync } from "node:sqlite";
import { z } from "zod";

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
