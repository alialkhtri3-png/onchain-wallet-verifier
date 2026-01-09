
import { useState } from "react";
import { ethers } from "ethers";
import EthereumProvider from "@walletconnect/ethereum-provider";

const BACKEND_URL = "http://192.168.1.100:3001";

export default function TrustWalletLogin() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  const loginWithTrustWallet = async () => {
    try {
      setStatus("🔄 جاري الاتصال بـ Trust Wallet...");

      // 1️⃣ إنشاء WalletConnect provider
      const wcProvider = await EthereumProvider.init({
        projectId: "example-project-id", // أي نص، لا يؤثر محليًا
        chains: [1],
        showQrModal: true,
      });

      await wcProvider.connect();

      const provider = new ethers.BrowserProvider(wcProvider);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      setAddress(userAddress);

      // 2️⃣ جلب nonce من الباكند
      const nonceRes = await fetch(`${BACKEND_URL}/nonce`, {
        credentials: "include",
      });
      const { nonce } = await nonceRes.json();

      // 3️⃣ إنشاء رسالة SIWE
      const message = `
onchain-wallet-verifier wants you to sign in with your Ethereum account:
${userAddress}

Sign in with Trust Wallet.

URI: http://192.168.1.100:5176
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}
      `.trim();

      // 4️⃣ توقيع الرسالة
      const signature = await signer.signMessage(message);

      // 5️⃣ التحقق في الباكند
      const verifyRes = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message,
          signature,
        }),
      });

      const result = await verifyRes.json();

      if (result.success) {
        setStatus("✅ تم تسجيل الدخول بنجاح");
      } else {
        setStatus("❌ فشل التحقق");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ حدث خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>تسجيل دخول SIWE</h2>

      <button
        onClick={loginWithTrustWallet}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        تسجيل الدخول باستخدام Trust Wallet
      </button>

      {address && (
        <p style={{ marginTop: "15px" }}>
          📌 Address: <b>{address}</b>
        </p>
      )}

      {status && (
        <p style={{ marginTop: "10px" }}>
          {status}
        </p>
      )}
    </div>
  );
}

