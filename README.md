onchain-wallet-verifier/
│
├─ src/
│   ├─ index.ts        ← backend (SIWE + session)
│   └─ types/
│       └─ express-session.d.ts
│
├─ frontend/
│   ├─ src/
│   │   └─ App.jsx     ← frontend (MetaMask + SIWE)
│   └─ package.json
│
├─ tsconfig.json
├─ package.json
└─ .gitignore

هProblem
Sybil attacks and fake wallet identities undermine trust in Web3 applications such as airdrops, DAO voting, and authentication systems.
Most existing solutions rely on KYC or invasive identity checks, which contradict Web3 values.
💡 Solution
Onchain Wallet Verifier provides a privacy-preserving, KYC-free way to verify wallet ownership and derive a basic reputation signal using onchain data and cryptographic signatures.
🛠️ How it Works
Message signing (EIP-191 / EIP-712)
Signature verification (no private keys stored)
Onchain analysis (wallet age, tx count, interactions)
Simple API response with verification + score
🌍 Impact
Fair airdrops
Sybil-resistant DAO voting
Web3 login without Google/KYC
Open infrastructure for developers
🚀 Why Open Source
Trust infrastructure must be transparent and auditable.
This project is MIT-licensed and designed to be extended by the ecosystem.Onchain Wallet Verifier

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
Onchain Wallet Verifier
Privacy-first wallet verification & onchain reputation — without KYC
🚀 What is this?
Onchain Wallet Verifier is an open-source infrastructure that proves wallet ownership and returns a basic onchain reputation score, without collecting identities or using KYC.
It answers one core question in Web3:
“Is this a real wallet controlled by a real user — without knowing who they are?”
❌ The Problem
Web3 suffers from:
Sybil attacks (fake wallets farming rewards)
Unfair airdrops
Weak DAO voting systems
Centralized Web2 logins replacing decentralization
Most current solutions rely on KYC, social graphs, or invasive tracking — which breaks Web3 principles.
✅ The Solution
Onchain Wallet Verifier uses:
Cryptographic signatures (no private keys shared)
Pure onchain data
Transparent scoring logic
To provide:
Wallet ownership verification
Lightweight reputation signal
Privacy-preserving trust
🧠 How It Works
User signs a message (EIP-191 / EIP-712)
Server verifies signature
Onchain activity is analyzed
API returns:
verified: true | false
score: 0–100
reputation details
🔌 API Example
POST /verify
نسخ التعليمات البرمجية
Json
{
  "address": "0x...",
  "message": "Sign to verify",
  "signature": "0x..."
}
Response:
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
🌍 Use Cases
Fair airdrops
Sybil-resistant DAO voting
Web3 login (Sign-in-with-wallet)
Reputation gating for dApps
Grant & community tooling
🛠 Supported Networks
Ethereum
Base
(EVM-compatible, multi-chain ready)
🧩 Why This Matters
No KYC
No identity leakage
No central authority
Fully auditable
Developer-first API
This is infrastructure, not an app.
🧭 Roadmap
Replay protection (nonce)
Multi-chain scoring
Reputation weighting
SDK (JS)
Hosted API option
🤝 Open Source & Grants
This project is MIT-licensed and designed for ecosystem adoption.
Ideal for grants focused on:
Privacy
Sybil resistance
Web3 infrastructure
DAO tooling
📬 Contact / Contribution
Issues, PRs, and ecosystem collaborations are welcome.Grant Proposal — Onchain Wallet Verifier
Project Name
Onchain Wallet Verifier
Category
Web3 Infrastructure · Privacy · Sybil Resistance · DAO Tooling
Problem Statement
Web3 ecosystems suffer heavily from Sybil attacks, where a single user controls many wallets to exploit:
Airdrops
Grants
DAO voting
Incentive programs
Current solutions often rely on:
KYC and identity verification
Social graph analysis
Centralized identity providers
These approaches violate Web3 principles by introducing privacy risks, exclusion, and central points of failure.
Proposed Solution
Onchain Wallet Verifier is an open-source infrastructure that:
Cryptographically verifies wallet ownership
Analyzes onchain behavior
Returns a lightweight reputation score
Requires no KYC and no identity data
It enables trust without identity disclosure.
How It Works
User signs a message using their wallet (EIP-191 / EIP-712)
Backend verifies signature ownership
Onchain data is analyzed (age, tx count, interactions)
API returns:
Verification result
Reputation score (0–100)
Transparent metrics
Why This Is Needed
DAOs need fair voting
Protocols need Sybil resistance
Airdrops need fairness
Web3 logins need alternatives to Web2 OAuth
This project provides a neutral trust primitive for Web3.
Target Users
DAO platforms
DeFi & NFT protocols
Grant programs
Web3 authentication systems
Ecosystem tooling builders
Technical Stack
Node.js + TypeScript
Express
ethers.js
EVM-compatible chains
Fully open-source, auditable, and composable.
Roadmap
Phase 1 (Current)
Wallet signature verification
Basic reputation scoring
Public API
Phase 2
Nonce & replay protection
Multi-chain scoring
Weighting logic
Phase 3
JS SDK
Hosted API option
DAO-specific integrations
Expected Impact
Reduced Sybil exploitation
Increased fairness in ecosystem incentives
Privacy-preserving trust infrastructure
Broader adoption of non-KYC solutions
Open Source Commitment
MIT License
Public roadmap
Community-driven development
Funding Usage
Grant funding will be used for:
Core protocol development
Security hardening
Documentation & SDKs
Community testing & feedback
Long-Term Vision
To become a standard, privacy-first wallet verification layer used across Web3 ecosystems.
Not an app.
Not a gatekeeper.
But infrastructure.
frontend/
 ├─ index.html
 ├─ main.jsx
 └─ package.json
onchain-wallet-verifier/
│
├─ src/
│   ├─ index.ts        # Backend (SIWE + sessions)
│   └─ types/
│       └─ express-session.d.ts
│
├─ frontend/
│   ├─ src/
│   │   └─ App.jsx     # Frontend (MetaMask + SIWE)
│   └─ package.json
│
├─ tsconfig.json
├─ package.json
└─ .gitignore
SIWE Authentication Demo for Base (EVM)
Secure nonce generation, verification, and replay protection.
## 🔐 Wallet Ownership Verification

This project demonstrates how to verify EVM wallet ownership using cryptographic
signatures.

The flow:
1. User connects an EVM wallet
2. The app generates a message
3. The user signs the message
4. The signature is verified to prove wallet ownership

This repository is intended as a reference implementation and learning demo.
## 👤 Project Identity & Ownership

The author and maintainer of this project is verified using a W3C DID (Decentralized Identifier).

- **DID Web:** `did:web:ali.cb.id`
- **Network:** Base (Chain ID 8453)
- **Wallet:** `0xB45A7510EaaD1Ef02CFaD55C67c0EA084CDD40d2`

The DID document is publicly available at:
https://ali.cb.id/.well-known/did.json

This proves that the project, the domain, and the wallet are controlled by the same entity.
Onchain Wallet Verifier
A ready-made API to cryptographically prove wallet ownership.
No private keys. No transactions. No auth system.
Just sign a message → verify ownership.
What this does
Many teams don’t need full Web3 auth.
They just want a simple, reliable way to prove that a user owns a wallet.
This service provides exactly that.
How it works (SIWE-style)
Backend generates a nonce
User signs the message with their wallet
Backend verifies the signature
You get confirmed wallet ownership
That’s it.
Why teams use this
✅ No private keys
✅ No permissions
✅ No transactions
✅ No funds access
✅ Chain-agnostic logic
✅ Works with existing apps
Perfect for:
Web3 apps
NFT gating
Account linking
Proof-of-ownership flows
Internal tools
API Overview
GET /nonce
Returns a unique nonce for the wallet to sign.
Response
نسخ التعليمات البرمجية
Json
{ "nonce": "uuid-string" }
POST /verify
Verifies the signed message and confirms wallet ownership.
Input
wallet address
message
signature
Output
verified: true / false
recovered address
Status
✅ Working MVP
✅ Used in real integration
🚧 SaaS & hosted version coming soon
Looking for integration?
We offer:
Setup & integration
Customization
Early access hosting
📩 Contact: via GitHub / Telegram
Philosophy
Most developers don’t need auth —
they just need to know who owns the wallet.
بعد ما تحطه README ⏭️
اعمل 3 أشياء بس:
1️⃣ احفظ الرابط
نسخ التعليمات البرمجية

https://github.com/alialkhtri3-png/onchain-wallet-verifier
