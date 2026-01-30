import fetch from "node-fetch";
import { createClient } from "graphql-ws";
import WebSocket from "ws";

/* ===== إعدادات Bitquery ===== */
const CLIENT_ID = process.env.BITQUERY_CLIENT_ID;
const CLIENT_SECRET = process.env.BITQUERY_CLIENT_SECRET;

/* ===== إعداد الفلاتر ===== */
const FILTER_TOKEN = "SOL";          // الرمز الذي تريد متابعته
const ALERT_VOLUME_THRESHOLD = 1000000; // تنبيه إذا تجاوز حجم التداول 1 مليون
const ALERT_PRICE_CHANGE = 5;        // تنبيه إذا تغير السعر 5% في فترة قصيرة

/* ===== متغيرات ===== */
let lastUpdateAt = Date.now();
let streamHealthy = true;
let lastPrices = {}; // لتخزين آخر الأسعار للرموز

/* ===== الحصول على Access Token ===== */
let accessToken = null;
let tokenExpiresAt = 0;

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
  if (!data.access_token) throw new Error("Cannot authenticate");

  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000; // خصم دقيقة
  return accessToken;
}

/* ===== Fallback Query ===== */
async function fallbackQuery() {
  try {
    const token = await getAccessToken();

    const query = `
      query {
        dexTrades(
          options: {limit: 10, desc: "tradeAmount"}
          baseCurrency: {is: "${FILTER_TOKEN}"}
        ) {
          baseCurrency { symbol }
          quoteCurrency { symbol }
          tradeAmount
          quotePrice
          date { date }
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
    json.data.dexTrades.forEach((trade) => {
      const key = trade.quoteCurrency.symbol;
      const prevPrice = lastPrices[key] || trade.quotePrice;
      const priceChangePercent = ((trade.quotePrice - prevPrice) / prevPrice) * 100;

      lastPrices[key] = trade.quotePrice;

      if (trade.tradeAmount > ALERT_VOLUME_THRESHOLD || Math.abs(priceChangePercent) > ALERT_PRICE_CHANGE) {
        console.log(`🚨 ALERT: ${trade.baseCurrency.symbol}/${trade.quoteCurrency.symbol}`);
        console.log(`Trade Amount: ${trade.tradeAmount}, Price: ${trade.quotePrice}, Change: ${priceChangePercent.toFixed(2)}%`);
      } else {
        console.log(`✅ ${trade.baseCurrency.symbol}/${trade.quoteCurrency.symbol} - Price: ${trade.quotePrice}, Volume: ${trade.tradeAmount}`);
      }
    });
  } catch (err) {
    console.error("❌ Fallback error:", err);
  }
}

/* ===== Streaming (اختياري) ===== */
async function startStreaming() {
  const token = await getAccessToken();

  const wsClient = createClient({
    url: "wss://streaming.bitquery.io/graphql",
    webSocketImpl: WebSocket,
    connectionParams: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  wsClient.subscribe(
    {
      query: `
        subscription {
          dexTrades(
            baseCurrency: {is: "${FILTER_TOKEN}"}
            options: {limit: 5}
          ) {
            baseCurrency { symbol }
            quoteCurrency { symbol }
            tradeAmount
            quotePrice
            date { date }
          }
        }
      `,
    },
    {
      next: (data) => {
        const trades = data.data?.dexTrades;
        if (!trades) return;

        lastUpdateAt = Date.now();
        streamHealthy = true;

        trades.forEach((trade) => {
          const key = trade.quoteCurrency.symbol;
          const prevPrice = lastPrices[key] || trade.quotePrice;
          const priceChangePercent = ((trade.quotePrice - prevPrice) / prevPrice) * 100;

          lastPrices[key] = trade.quotePrice;

          if (trade.tradeAmount > ALERT_VOLUME_THRESHOLD || Math.abs(priceChangePercent) > ALERT_PRICE_CHANGE) {
            console.log(`🚨 STREAM ALERT: ${trade.baseCurrency.symbol}/${trade.quoteCurrency.symbol}`);
            console.log(`Trade Amount: ${trade.tradeAmount}, Price: ${trade.quotePrice}, Change: ${priceChangePercent.toFixed(2)}%`);
          } else {
            console.log(`🟢 STREAM: ${trade.baseCurrency.symbol}/${trade.quoteCurrency.symbol} - Price: ${trade.quotePrice}, Volume: ${trade.tradeAmount}`);
          }
        });
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

