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
Json
{
  "verified": true,
  "score": 72,
  "details": {
    "walletAgeDays": 420,
    "txCount"
- 
-
## Quick Start

```bash
git clone https://github.com/alialkhtri3-png/onchain-wallet-verifier.git
cd onchain-wallet-verifier
npm install
npm run dev
Message signing only
No private keys stored
No KYC
Stateless verification
🧠 Use Cases
Sybil-resistant airdrops
DAO voting eligibility
Web3 login (Sign-in with Wallet)
Reputation-based access control
🚀 Roadmap
[ ] Nonce-based replay protection
[ ] Multi-chain support
[ ] Reputation weighting
[ ] SDK (JS)
[ ] Hosted API
🤝 Contributing
Open to contributors and collaborators.
