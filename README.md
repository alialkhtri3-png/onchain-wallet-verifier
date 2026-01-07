# onchain-wallet-verifier
Verify wallet ownership and basic onchain reputation without KYC.
# Onchain Wallet Verifier

Open infrastructure to verify wallet ownership and basic onchain reputation — without KYC.

## What it does
Onchain Wallet Verifier confirms that a user controls a wallet and returns a simple reputation signal based on onchain activity.

## Why it matters
Web3 needs trust without identity leakage.
This tool helps:
- Prevent Sybil attacks
- Enable fair airdrops
- Secure DAO voting
- Power Web3 login without Google or KYC

## How it works
1. User signs a message (EIP-191 / EIP-712)
2. Signature is verified on the server
3. Onchain data is analyzed
4. A verification result + score is returned

## Supported Networks
- Ethereum
- Base (EVM compatible)

## Reputation Signals (MVP)
- Wallet age
- Transaction count
- Contract interactions
- ENS (optional)

## API Example
POST `/verify`
```json
{
  "address": "0x...",
  "signature": "0x...",
  "message": "..."
}
{
  "verified": true,
  "score": 72,
  "details": {
    "walletAgeDays": 420,
    "txCount": 133
  }
}---

## 🧠 بالعربي (الخلاصة)
هذا المشروع **مش تطبيق عادي**  
هذا **بنية تحتية**:  
> يثبت إن الشخص يملك المحفظة  
> ويعطي ثقة مبدئية بدون KYC  

وهذا بالضبط اللي:
- المنح تحبه  
- الـ DAOs تحتاجه  
- السوق يدفع له  

---

## الخطوة الجاية (نختار وحدة ونبدأ فورًا)
اكتب رقم الخيار فقط:

**1️⃣ تصميم API النهائي (Endpoints + logic)**  
**2️⃣ هيكلة المشروع (Folders + Stack)**  
**3️⃣ سكربت التحقق والتوقيع (Core logic)**  

أنا جاهز نكمله حبة حبة 💪
