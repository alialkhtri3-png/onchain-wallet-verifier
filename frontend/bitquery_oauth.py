import requests

def oAuth_example():
    # 1️⃣ طلب التوكن
    url = "https://oauth2.bitquery.io/oauth2/token"
    payload = {
        'grant_type': 'client_credentials',
        'client_id': 'YOUR_ID_HERE',
        'client_secret': 'YOUR_SECRET_HERE',
        'scope': 'api'
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    
    response = requests.post(url, headers=headers, data=payload)
    
    if response.status_code != 200:
        print("Error getting access token:", response.text)
        return
    
    resp = response.json()
    print("Access Token Response:", resp)
    access_token = resp['access_token']

    # 2️⃣ استخدام التوكن لطلب GraphQL
    url_graphql = "https://streaming.bitquery.io/graphql"
    headers_graphql = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }

    graphql_query = {
        "query": """
        {
          EVM(network: bsc) {
            Transfers(
              options: {limit: 5, desc: "Block_Time"}
            ) {
              Transfer {
                Amount
                AmountInUSD
                Sender { Address }
                Receiver { Address }
                Currency { Symbol Name }
              }
              Block { Time Number }
            }
          }
        }
        """
    }

    response_graphql = requests.post(url_graphql, headers=headers_graphql, json=graphql_query)
    
    if response_graphql.status_code != 200:
        print("GraphQL Error:", response_graphql.text)
        return

    data = response_graphql.json()
    print("GraphQL Response:", data)


# استدعاء الدالة
oAuth_example()

