import { ethers } from "ethers";
import { SiweMessage } from "siwe";

async function connectAndSign() {
  if (!window.ethereum) {
    alert("Wallet not found");
    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign in with Ethereum to Onchain Wallet Verifier",
    uri: window.location.origin,
    version: "1",
    chainId: 1,
  });

  const signature = await signer.signMessage(
    message.prepareMessage()
  );

  const res = await fetch("http://10.55.47.130:3000/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      signature,
    }),
  });

  const result = await res.json();
  console.log("VERIFY RESULT:", result);

  alert(result.verified ? "✅ Verified!" : "❌ Failed");
}

(document.getElementById("connect") as HTMLButtonElement)
  .addEventListener("click", connectAndSign))

