
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";

const BACKEND = "http://10.53.52.174:3002";

function App() {
  const [address, setAddress] = useState("");
  const [nonce, setNonce] = useState("");
  const [status, setStatus] = useState("");

  // 1️⃣ جلب nonce
  const fetchNonce = async () => {
    const res = await fetch(`${BACKEND}/nonce`);
    const data = await res.json();
    setNonce(data.nonce);
  };

  // 2️⃣ اتصال MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask غير مثبت");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();

    setAddress(addr);
    await fetchNonce();
  };

  // 3️⃣ توقيع SIWE
  const signInWithEthereum = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce,
    });

    const signature = await signer.signMessage(
      message.prepareMessage()
    );

    const res = await fetch(`${BACKEND}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        signature,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setStatus(`✅ تم التحقق: ${data.address}`);
    } else {
      setStatus("❌ فشل التحقق");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>SIWE Demo</h1>

      {!address && (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {address && (
        <>
          <p><b>Address:</b> {address}</p>
          <p><b>Nonce:</b> {nonce}</p>

          <button onClick={signInWithEthereum}>
            Sign-In with Ethereum
          </button>
        </>
      )}

      <p>{status}</p>
    </div>
  );
}

export default App;

