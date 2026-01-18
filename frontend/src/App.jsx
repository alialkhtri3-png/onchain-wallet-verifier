import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

const BACKEND_URL = "http://192.168.1.100:3000";

function App() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginWithEthereum = async () => {
    try {
      setError("");
      setStatus("");
      setLoading(true);

      // 1️⃣ التأكد من Trust Wallet / MetaMask
      if (!window.ethereum) {
        throw new Error("❗ افتح الصفحة من داخل Trust Wallet");
      }

      // 2️⃣ الاتصال بالمحفظة
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const addr = await signer.getAddress();
      setAddress(addr);

      const network = await provider.getNetwork();

      // 3️⃣ جلب nonce من السيرفر
      setStatus("🔐 جلب nonce من السيرفر...");
      const nonceRes = await fetch(`${BACKEND_URL}/nonce`, {
        credentials: "include",
      });
      const { nonce } = await nonceRes.json();

      // 4️⃣ إنشاء رسالة SIWE
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

      // 5️⃣ توقيع الرسالة
      setStatus("✍️ وقّع الرسالة من المحفظة...");
      const signature = await signer.signMessage(message);

      // 6️⃣ إرسال التوقيع للتحقق
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
      setError(err.message || "❌ حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>SIWE Login (Trust Wallet)</h2>

      <button
        style={styles.button}
        onClick={loginWithEthereum}
        disabled={loading}
      >
        {loading ? "⏳ جاري المعالجة..." : "Login with Trust Wallet"}
      </button>

      {address && (
        <p style={styles.address}>
          🟢 العنوان:
          <br />
          {address}
        </p>
      )}

      {status && <p>{status}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    borderRadius: 10,
    background: "#111",
    color: "#fff",
    textAlign: "center",
  },
  button: {
    padding: "12px 20px",
    fontSize: 16,
    cursor: "pointer",
    borderRadius: 8,
  },
  address: {
    marginTop: 10,
    wordBreak: "break-all",
    color: "#0f0",
  },
};

export default App;

