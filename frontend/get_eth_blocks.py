import requests
import json

# استبدل YOUR_ACCESS_TOKEN بالتوكن الذي حصلت عليه من Bitquery
ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"

# رابط API الخاص بـ Bitquery
URL = "https://graphql.bitquery.io/"

# استعلام GraphQL
graphql_query = """
query MyQuery {
  ethereum(network: ethereum) {
    blocks {
      count
    }
  }
}
"""

# إعداد الهيدر مع التوكن
headers = {
    "Content-Type": "application/json",
    "X-API-KEY": ACCESS_TOKEN
}

# إرسال الاستعلام
response = requests.post(URL, headers=headers, json={"query": graphql_query})

# تحويل النتيجة من JSON
data = response.json()

# طباعة النتيجة
print(json.dumps(data, indent=2))

# حفظ النتيجة في ملف
with open("eth_blocks.json", "w") as f:
    json.dump(data, f, indent=2)

print("تم حفظ النتيجة في eth_blocks.json")

