import express from "express";
import cors from "cors";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import { SiweMessage } from "siwe";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const app = express()
const PORT = 3333;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.100:5173",
    ],
    credentials: true,
  })
);

// ===== ENS client =====
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

async function resolveENS(address) {
  return await client.getEnsName({ address });
}

// ===== nonce =====
let currentNonce = null;

app.get("/nonce", (req, res) => {
  currentNonce = crypto.randomUUID();
  res.json({ nonce: currentNonce });
});

// ===== verify =====
app.post("/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });

    if (result.data.nonce !== currentNonce) {
      return res.status(400).json({ ok: false });
    }

    const address = result.data.address;
    const ens = await resolveENS(address);

    res.json({
      ok: true,
      address,
      ens,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`);
});

