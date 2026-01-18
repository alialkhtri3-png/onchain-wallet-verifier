const PROJECT_IDENTITY = {
  did: "did:web:ali.cb.id",
  wallet: "0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2",
  network: "base"
};

import cors from "cors";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.100:5173",
    ],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
import session from "express-session";

app.use(
  session({
    name: "onchain.sid",
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // لأننا على http
    },
  })
);

