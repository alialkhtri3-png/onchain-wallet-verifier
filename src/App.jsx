import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

const BACKEND_URL = "http://10.58.20.89:3000"; 
// ⚠️ إذا تغيّر IP عدّله هنا

function App() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setError("");
      setStatus("");
      setLoading(true);

      if (!window.ethereum) {
        throw new Error("❗ افتح الصفحة من داخل Trust Wallet أو MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const network = await provider.getNetwork();

      setAddress(addr);
      setStatus("🔐 طلب nonce من السيرفر...");

      // 1️⃣ nonce
      const nonceRes = await fetch(`${BACKEND_URL}/nonce`, {
        credentials: "include",
      });
      const { nonce } = await nonceRes.json();

      // 2️⃣ رسالة SIWE
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: addr,
        statement: "Sign in with Ethereum",
        uri: window.location.origin,
        version: "1",
        chainId: Number(network.chainId),
        nonce,
      });

      const message = siweMessage.prepareMessage();

      setStatus("✍️ وقّع الرسالة من المحفظة...");
      const signature = await signer.signMessage(message);

      // 3️⃣ تحقق
      setStatus("🔍 جارٍ التحقق...");
      const verifyRes = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, signature }),
      });

      const result = await verifyRes.json();

      if (!result.success) {
        throw new Error("❌ فشل التحقق");
      }

      setStatus("✅ تم تسجيل الدخول بنجاح");
    } catch (err) {
      console.error(err);
      setError(err.message || "❌ حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const checkMe = async () => {
    const res = await fetch(`${BACKEND_URL}/me`, {
      credentials: "include",
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>Onchain Wallet Verifier (SIWE)</h2>

      <button onClick={login} disabled={loading}>
        {loading ? "⏳ جاري المعالجة..." : "Login with Wallet"}
      </button>

      <button onClick={checkMe} style={{ marginLeft: 10 }}>
        Check /me
      </button>

      {address && <p>🟢 Address: {address}</p>}
      {status && <p>{status}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;

