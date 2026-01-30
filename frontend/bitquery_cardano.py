import requests
import json

# ===============================
# 🔑 ضع هنا مفتاح API أو Access Token الخاص بك
ACCESS_TOKEN = "YOUR_ACCESS_TOKEN_HERE"
# ===============================

# 🌐 رابط GraphQL الخاص بـ Bitquery
URL_GRAPHQL = "https://streaming.bitquery.io/graphql"

# 👤 إعدادات الهيدر مع التوكن
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}

# ===============================
# استعلام GraphQL: يمكن تعديله هنا
# network: bsc / eth / etc
# limit: عدد النتائج
# smart contract: رمز العملة
# ===============================
GRAPHQL_QUERY = '''
{
  EVM(dataset: realtime, network: bsc) {
    BalanceUpdates(
      orderBy: {descending: BalanceUpdate_Amount}
      limit: {count: 10}
      where: {Currency: {SmartContract: {is: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47"}}}
    ) {
      BalanceUpdate {
        Address
        Amount
      }
      Currency {
        Name
      }
    }
  }
}
'''

def fetch_bitquery_data():
    payload = {"query": GRAPHQL_QUERY}
    response = requests.post(URL_GRAPHQL, headers=HEADERS, json=payload)

    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return

    data = response.json()

    # طباعة النتائج بشكل مرتب
    updates = data.get("data", {}).get("EVM", {}).get("BalanceUpdates", [])
    for idx, item in enumerate(updates, start=1):
        addr = item["BalanceUpdate"]["Address"]
        amount = item["BalanceUpdate"]["Amount"]
        token_name = item["Currency"]["Name"]
        print(f"{idx}. Address: {addr} | Amount: {amount} {token_name}")

if __name__ == "__main__":
    fetch_bitquery_data()

