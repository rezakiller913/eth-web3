const connectBtn = document.getElementById("connectBtn");

connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts"
  });

  const address = accounts[0];
  document.getElementById("wallet").innerText = address;

  const balanceHex = await ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"]
  });

  const balance = parseInt(balanceHex, 16) / 1e18;
  document.getElementById("balance").innerText =
    balance.toFixed(4) + " ETH";

  const chainId = await ethereum.request({
    method: "eth_chainId"
  });

  document.getElementById("network").innerText =
    chainId === "0x1" ? "Ethereum Mainnet" : "Testnet";
};

(async () => {
  const block = await getBlockNumber();
  document.getElementById("block").innerText = block;
})();
