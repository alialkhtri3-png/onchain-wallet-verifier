import express from "express";
import cors from "cors";
import session from "express-session";
import { SiweMessage } from "siwe";
import crypto from "crypto";

/* 🔹 توسيع express-session */
declare module "express-session" {
  interface SessionData {
    nonce?: string;
    siwe?: {
      address: string;
      chainId: number;
      domain: string;
      issuedAt?: string;
      nonce: string;
    };
  }
}

const app = express();
const PORT = 3000;

/* 🔹 Middlewares */
app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  session({
    name: "siwe-session",
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // اجعلها true فقط مع HTTPS
      sameSite: "lax",
    },
  })
);

/* 🔹 إنشاء nonce */
app.get("/nonce", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  req.session.nonce = nonce;
  res.json({ nonce });
});

/* 🔹 التحقق من التوقيع */
app.post("/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    if (!req.session.nonce) {
      return res.status(400).json({ success: false, error: "No nonce in session" });
    }

    const siweMessage = new SiweMessage(message);

    const fields = await siweMessage.verify({
      signature,
      nonce: req.session.nonce,
    });

    req.session.siwe = {
      address: fields.data.address,
      chainId: fields.data.chainId,
      domain: fields.data.domain,
      issuedAt: fields.data.issuedAt,
      nonce: fields.data.nonce,
    };

    req.session.nonce = undefined;

    res.json({
      success: true,
      address: fields.data.address,
    });
  } catch (err) {
    console.error("SIWE verify error:", err);
    res.status(401).json({ success: false });
  }
});

/* 🔹 حالة تسجيل الدخول */
app.get("/me", (req, res) => {
  if (!req.session.siwe) {
    return res.json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    address: req.session.siwe.address,
  });
});

/* 🔹 تشغيل السيرفر */
app.listen(PORT, () => {
  console.log(`🚀 Onchain Wallet Verifier running on port ${PORT}`);
});
