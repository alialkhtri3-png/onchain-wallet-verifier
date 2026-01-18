import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

const BACKEND_URL = "http://192.168.1.100:3001"; // عدّل IP إذا تغيّر

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

      if (!window.ethereum) {
        throw new Error("❗ افتح الصفحة من داخل Trust Wallet");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      // طلب الاتصال بالمحفظة
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const network = await provider.getNetwork();

      setAddress(addr);
      setStatus("🔐 طلب nonce من السيرفر...");

      // ✅ nonce من السيرفر (JSON)
      const nonceRes = await fetch(`${BACKEND_URL}/nonce`, {
        credentials: "include",
      });
      const { nonce } = await nonceRes.json();

      // ✅ إنشاء رسالة SIWE
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

      setStatus("🔍 جارٍ التحقق...");

      // ✅ أرسل message كنص
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

      {status && <p style={styles.status}>{status}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    fontFamily: "sans-serif",
    padding: "16px",
    textAlign: "center",
  },
  button: {
    padding: "14px 24px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#f5b300",
    color: "#000",
  },
  address: {
    wordBreak: "break-all",
    fontSize: "14px",
  },
  status: {
    color: "green",
  },
  error: {
    color: "red",
  },
};

export default App;

