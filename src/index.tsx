const express = require("express");

const app = express();
app.use(express.json());

app.post("/verify", async (req, res) => {
  const { address, signature, message } = req.body;

  if (!address || !signature || !message) {
    return res.status(400).json({
      error: "Missing parameters"
    });
  }

  // (مؤقتًا) نتيجة وهمية — سنجعلها حقيقية لاحقًا
  return res.json({
    verified: true,
    score: 72,
    details: {
      walletAgeDays: 420,
      txCount: 133
    }
  });
});

app.listen(3000, () => {
  console.log("🚀 Onchain Wallet Verifier running on port 3000");
});

import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.post("/verify", async (req: Request, res: Response) => {
  return res.json({
    verified: true,
    score: 72,
    details: {
      walletAgeDays: 420,
      txCount: 133
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Onchain Wallet Verifier running on port ${PORT}`);
});

