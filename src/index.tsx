import express, { Request, Response } from "express";
import { ethers } from "ethers";

const app = express();
app.use(express.json());

app.post("/verify", async (req: Request, res: Response) => {
  const { address, signature, message } = req.body;

  if (!address || !signature || !message) {
    return res.status(400).json({
      verified: false,
      error: "Missing parameters",
    });
  }

  try {
    // التحقق الحقيقي من التوقيع
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        verified: false,
        error: "Signature does not match address",
      });
    }

    return res.json({
      verified: true,
      address: recoveredAddress,
      score: 100,
      details: {
        signatureValid: true,
      },
    });

  } catch (err: any) {
    return res.status(500).json({
      verified: false,
      error: "Verification failed",
      details: err.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Onchain Wallet Verifier running on port ${PORT}`);
});

