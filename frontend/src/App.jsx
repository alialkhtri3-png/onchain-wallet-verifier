import { useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

const API_URL = "http://10.55.47.130:3000";

function App() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  const login = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setAddress(address);

      // 🔹 nonce من السيرفر
      const nonceRes = await fetch(`${API_URL}/nonce`);
      const { nonce } = await nonceRes.json();

      // 🔹 إنشاء رسالة SIWE
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum",
        uri: window.location.origin,
        version: "1",
        chainId: Number(network.chainId),
        nonce,
      });

      const message = siweMessage.prepareMessage();

      // 🔹 التوقيع
      const signature = await signer.signMessage(message);

      // 🔹 التحقق في الباك-إند
      const verifyRes = await fetch(`${API_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          signature,
        }),
      });

      const result = await verifyRes.json();

      setStatus(
        result.success
          ? "✅ تم تسجيل الدخول بنجاح"
          : "❌ فشل التحقق"
      );
    } catch (e) {
      console.error(e);
      setStatus("❌ خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>SIWE Login</h2>
      <button onClick={login}>Login with MetaMask</button>
      <p>{address}</p>
      <p>{status}</p>
    </div>
  );
}

export default App;

