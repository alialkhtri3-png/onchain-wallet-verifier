import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.post("/verify", async (req: Request, res: Response) => {
  const { address } = req.body;

  res.json({
    verified: true,
    score: 72,
    details: {
      walletAgeDays: 420,
      txCount: 133,
    },
  });
});

app.listen(3000, () => {
  console.log("🚀 Onchain Wallet Verifier running on port 3000");
});

