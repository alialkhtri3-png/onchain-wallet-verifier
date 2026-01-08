import express, { Request, Response } from "express";
import { verifyMessage } from "ethers";

const app = express();
app.use(express.json());

app.post("/verify", (req: Request, res: Response) => {
  const { address, message, signature } = req.body;

  if (!address || !message || !signature) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const recovered = verifyMessage(message, signature);
    const verified =
      recovered.toLowerCase() === address.toLowerCase();

    return res.json({
      verified,
      recovered,
    });
  } catch (err) {
    return res.status(400).json({
      verified: false,
      error: "Invalid signature",
    });
  }
});

app.listen(3000, () => {
  console.log("🚀 Onchain Wallet Verifier running on port 3000");
});

