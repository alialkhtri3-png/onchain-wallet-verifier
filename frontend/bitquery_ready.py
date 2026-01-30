import requests
import json

# =====================================
# ضع Access Token هنا (انسخه كما هو)
ACCESS_TOKEN = "ory_at_75oGIIoKGvx1KFDo8FHahUeT__EuElHaiAqk6g7Oc3M.Jf2yuKCMZGdu7EZ9g_ceWVOEvZty4cg1xAT-8A8sYYY"
# =====================================

URL = "https://streaming.bitquery.io/graphql"

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}

QUERY = """
{
  ethereum(network: ethereum) {
    blocks {
      count
    }
  }
}
"""

def main():
    response = requests.post(
        URL,
        headers=HEADERS,
        json={"query": QUERY},
        timeout=30
    )

    if response.status_code != 200:
        print("❌ HTTP Error:", response.status_code)
        print(response.text)
        return

    try:
        data = response.json()
        print("✅ Success:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except Exception as e:
        print("❌ JSON Error:", e)
        print(response.text)

if __name__ == "__main__":
    main()

