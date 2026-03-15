import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./db";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is sprinting!");
});

app.get("/api/prices", async (req: Request, res: Response) => {
  try {
    const prices = await prisma.price.findMany({
      orderBy: { timestamp: "desc" },
    });
    res.json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/prices", async (req: Request, res: Response) => {
  try {
    const { coin, amount } = req.body;
    const newPrice = await prisma.price.create({
      data: { coin, amount },
    });
    res.json(newPrice);
  } catch (error) {
    res.status(500).json({ error: "Could not save price" });
  }
});

app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
