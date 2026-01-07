Onchain Wallet Verifier

Open infrastructure to verify wallet ownership and basic onchain reputation — without KYC.

## What it does
Onchain Wallet Verifier confirms that a user controls a wallet and returns a simple reputation signal based on onchain activity.

## Why it matters
Web3 needs trust without identity leakage.  
This tool helps:
- Prevent Sybil attacks
- Enable fair airdrops
- Secure DAO voting
- Power Web3 authentication without Google or KYC

## How it works
1. User signs a message (EIP-191 / EIP-712)
2. Signature is verified
3. Onchain data is analyzed
4. A verification result and score are returned

## Supported Networks
- Ethereum
- Base (EVM compatible)

## Reputation Signals (MVP)
- Wallet age
- Transaction count
- Contract interactions
- ENS (optional)

## API Example
**POST** `/verify`

Request:
```json
{
  "address": "0x...",
  "signature": "0x...",
  "message": "..."
}
استجابة:
```json
{
  "verified": true,
  "score": 72,
  "details": {
    "walletAgeDays": 420,
    "txCount": 133
  }> هذه النتيجة تُستخدم كإشارة ثقة أولية بدون كشف الهوية أو KYC.
}
## مثال على واجهة برمجة التطبيقات

**POST** `/verify`

### الطلب
```json
{
  "address": "0x...",
  "signature": "0x...",
  "message": "..."
}
الاستجابة
نسخ التعليمات البرمجية
Json
{
  "verified": true,
  "score": 72,
  "details": {
    "walletAgeDays": 420,
    "txCount": 133
  }
}
### ماذا سيحدث بعد اللصق؟
- ✅ المعاينة ستصير نظيفة
- ✅ لا تكرار
- ✅ README احترافي وجاهز للعرض على:
  - DAOs  
  - Grants  
  - Builders  
  - Reviewers  

🔥 **ملاحظة مهمة**:  
وجود README بهذا المستوى + فكرتك = مشروع **قابل للتمويل** فعليًا.

لو تحب:
- أضيف لك **Roadmap ذكي**
- أو **Quick Start للمطورين**
- أو نبدأ مباشرة **بكتابة أول endpoint
