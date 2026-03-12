import express, { Request, Response } from "express";

console.log("Script starting");
const app = express();
const PORT = 5001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up and running");
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Backend works", status: "success" });
});

app.listen(PORT, () => {
  console.log(`Server is sprinting at http://localhost:${PORT}`);
});
