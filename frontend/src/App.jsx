import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const message = "Verify wallet ownership for Onchain Wallet Verifier";

  async function connectAndSign() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const addr = await signer.getAddress();
      setAddress(addr);

      const sig = await signer.signMessage(message);
      setSignature(sig);

      const res = await fetch("http://localhost:3000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: addr,
          message,
          signature: sig,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Signature rejected or error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>🔐 Onchain Wallet Verifier</h1>

      <button onClick={connectAndSign} disabled={loading}>
        {loading ? "Signing..." : "Connect Wallet & Sign"}
      </button>

      {address && (
        <p>
          <b>Address:</b> {address}
        </p>
      )}

      {signature && (
        <p>
          <b>Signature:</b> {signature.slice(0, 20)}...
        </p>
      )}

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;

