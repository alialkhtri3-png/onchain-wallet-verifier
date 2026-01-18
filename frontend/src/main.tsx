import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [address, setAddress] = useState<string>("");
  const [nonce, setNonce] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const BACKEND_URL = "http://10.53.52.174:3002";

  // 🔌 Connect MetaMask
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAddress(addr);
  }

  // 🔢 Fetch nonce from backend
  async function fetchNonce() {
    try {
      const res = await fetch(`${BACKEND_URL}/nonce`);
      const data = await res.json();
      setNonce(data.nonce);
    } catch (err) {
      console.error("Failed to fetch nonce", err);
    }
  }

  // ✍️ Sign-In With Ethereum
  async function signInWithEthereum() {
    try {
      setLoading(true);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const message = `${window.location.host} wants you to sign in with your Ethereum account:
${address}

Nonce: ${nonce}`;

      const signature = await signer.signMessage(message);

      const res = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          signature,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("SIWE failed", err);
      alert("SIWE failed, check console");
    } finally {
      setLoading(false);
    }
  }

  // Auto fetch nonce after wallet connect
  useEffect(() => {
    if (address) {
      fetchNonce();
    }
  }, [address]);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>🔐 SIWE Demo</h1>

      {!address && (
        <button onClick={connectWallet}>
          🔌 Connect Wallet
        </button>
      )}

      {address && (
        <>
          <p>
            <b>Address:</b><br />
            {address}
          </p>

          <p>
            <b>Nonce:</b><br />
            {nonce || "Loading..."}
          </p>

          {nonce && (
            <button onClick={signInWithEthereum} disabled={loading}>
              {loading ? "Signing..." : "✍️ Sign-In With Ethereum"}
            </button>
          )}
        </>
      )}

      {result && (
        <>
          <hr />
          <h3>✅ Verify Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;

