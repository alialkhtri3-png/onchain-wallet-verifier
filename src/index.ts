import express from "express";
import cors from "cors";
import { SiweMessage } from "siwe";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/nonce", (_req, res) => {
  const nonce = Math.random().toString(36).substring(2);
  res.json({ nonce });
});

app.post("/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    if (!message || !signature) {
      return res.status(400).json({ success: false });
    }

    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    if (!fields.success) {
      return res.status(401).json({ success: false });
    }

    res.json({
      success: true,
      address: fields.data.address,
    });
  } catch (err) {
    console.error("SIWE verify error:", err);
    res.status(500).json({ success: false });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running on http://0.0.0.0:3000");
});

