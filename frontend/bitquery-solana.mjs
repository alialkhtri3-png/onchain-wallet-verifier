import { createClient } from "graphql-ws";
import WebSocket from "ws";
import fetch from "node-fetch";

const API_KEY = process.env.BITQUERY_API_KEY;

import { createClient } from "graphql-ws";
import WebSocket from "ws";
import fetch from "node-fetch";

/* ===== إعداد المتغيرات ===== */
const CLIENT_ID = process.env.BITQUERY_CLIENT_ID;
const CLIENT_SECRET = process.env.BITQUERY_CLIENT_SECRET;

let lastUpdateAt = Date.now();
let streamHealthy = true;
let lastKnownSlot = 0;
let accessToken = null;
let tokenExpiresAt = 0;

/* ===== دالة الحصول على Access Token ===== */
async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;

  const res = await fetch("https://oauth.bitquery.io/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    console.error("❌ Failed to get access token:", data);
    throw new Error("Cannot authenticate with Bitquery API");
  }

  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000; // تجديد قبل دقيقة
  return accessToken;
}

/* ===== دالة Fallback Query ===== */
async function fallbackQuery() {
  try {
    const token = await getAccessToken();

    const query = `
      query {
        Solana {
          BalanceUpdates(
            where: { Block: { Slot: { gt: ${lastKnownSlot} } } }
            limit: { count: 5 }
          ) {
            BalanceUpdate {
              Account
              PostBalance
              Currency { Symbol }
            }
            Block { Slot }
          }
        }
      }
    `;

    const res = await fetch("https://graphql.bitquery.io", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();

    json.data?.Solana?.BalanceUpdates?.forEach((u) => {
      if (u.Block.Slot > lastKnownSlot) {
        lastKnownSlot = u.Block.Slot;
        console.log("🟡 FALLBACK:", u.BalanceUpdate);
      }
    });
  } catch (err) {
    console.error("❌ Fallback error:", err);
  }
}

/* ===== دالة بدء Streaming ===== */
async function startStreaming() {
  const token = await getAccessToken();

  const wsClient = createClient({
    url: "wss://streaming.bitquery.io/graphql",
    webSocketImpl: WebSocket,
    connectionParams: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  wsClient.subscribe(
    {
      query: `
        subscription {
          Solana {
            BalanceUpdates {
              BalanceUpdate {
                Account
                PostBalance
                Currency { Symbol }
              }
              Block { Slot }
            }
          }
        }
      `,
    },
    {
      next: (data) => {
        const u = data.data?.Solana?.BalanceUpdates;
        if (!u) return;

        const slot = u.Block?.Slot || 0;
        if (slot <= lastKnownSlot) return;

        lastKnownSlot = slot;
        lastUpdateAt = Date.now();
        streamHealthy = true;

        console.log("🟢 STREAM:", u.BalanceUpdate);
      },
      error: (err) => {
        console.error("❌ STREAM ERROR:", err);
        streamHealthy = false;
      },
      complete: () => (streamHealthy = false),
    }
  );
}

/* ===== Health Check ===== */
setInterval(() => {
  if (Date.now() - lastUpdateAt > 15000) {
    streamHealthy = false;
    console.log("⚠️ Streaming delayed → fallback");
  }
}, 15000);

/* ===== Fallback Interval ===== */
setInterval(() => {
  if (!streamHealthy) fallbackQuery();
}, 20000);

/* ===== Start ===== */
startStreaming().catch(console.error);

