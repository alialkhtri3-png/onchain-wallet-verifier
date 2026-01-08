import express from "express";
import cors from "cors";
import crypto from "crypto";
import session from "express-session";
import { SiweMessage } from "siwe";

const app = express();

// مهم
app.set("trust proxy", 1);

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
    secret: "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ===== routes =====

// nonce
app.get("/nonce", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  (req.session as any).nonce = nonce;
  res.json({ nonce });
});

// verify
app.post("/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;

    const siwe = new SiweMessage(message);
    const fields = await siwe.verify({
      signature,
      nonce: (req.session as any).nonce,
    });

    (req.session as any).user = {
      address: fields.data.address,
      chainId: fields.data.chainId,
    };

    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ success: false });
  }
});

// me
app.get("/me", (req, res) => {
  const user = (req.session as any).user;
  if (!user) {
    return res.status(401).json({ loggedIn: false });
  }
  res.json({ loggedIn: true, user });
});

// logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.listen(3000, () => {
  console.log("🚀 Onchain Wallet Verifier running on port 3000");
});

