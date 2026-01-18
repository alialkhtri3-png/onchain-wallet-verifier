import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

function App() {
  const [address, setAddress] = useState("");
  const [nonce, setNonce] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAddress(addr);
  }

  async function fetchNonce() {
    const res = await fetch("http://10.53.52.174:3002/nonce");
    const data = await res.json();
    setNonce(data.nonce);
  }

  useEffect(() => {
    if (address) fetchNonce();
  }, [address]);

  return (
    <div style={{ padding: 24 }}>
      <h1>SIWE Demo</h1>

      {!address ? (
        <button onClick={connectWallet}>🔌 Connect Wallet</button>
      ) : (
        <>
          <p><b>Address:</b> {address}</p>
          <p><b>Nonce:</b> {nonce || "Loading..."}</p>
        </>
      )}
    </div>
  );
}

export default App;

