import fetch from 'node-fetch';

const TOKEN = 'ory_at_XXXXXXXX'; // ضع توكن Bitquery الصحيح هنا

const query = `
query ($network: EthereumNetwork!) {
  ethereum(network: $network) {
    dexTrades(options: {limit: 5, desc: "tradeAmountUSD"}) {
      tradeAmountUSD
      baseCurrency { symbol }
      quoteCurrency { symbol }
    }
  }
}
`;

const variables = { network: 'ethereum' };

async function fetchDexTrades() {
  const res = await fetch('https://streaming.bitquery.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

fetchDexTrades();

