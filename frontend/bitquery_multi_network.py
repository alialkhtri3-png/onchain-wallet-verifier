import requests
import json

API_KEY = "YOUR_API_KEY_HERE"  # ضع مفتاحك هنا

url_graphql = "https://streaming.bitquery.io/graphql"
headers_graphql = {
    "Content-Type": "application/json",
    "X-API-KEY": API_KEY
}

graphql_query = '''
{
  EVM(network: ethereum) {
    DEXTrades(limit: {count: 5}) {
      Transaction {
        Hash
      }
      Trade {
        Buy {
          Amount
          Currency { Name }
        }
        Sell {
          Amount
          Currency { Name }
        }
      }
    }
  }
}
'''

payload = json.dumps({"query": graphql_query})

response = requests.post(url_graphql, headers=headers_graphql, data=payload)

print(response.text)

