const connectBtn = document.getElementById("connectBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentAccount = null;

// CONNECT WALLET
connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return;
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts"
  });

  currentAccount = accounts[0];

  document.getElementById("wallet").innerText = currentAccount;

  const balanceHex = await ethereum.request({
    method: "eth_getBalance",
    params: [currentAccount, "latest"]
  });

  const balance = parseInt(balanceHex, 16) / 1e18;
  document.getElementById("balance").innerText =
    balance.toFixed(4) + " ETH";

  const chainId = await ethereum.request({ method: "eth_chainId" });
  document.getElementById("network").innerText =
    chainId === "0x1" ? "Ethereum Mainnet" : "Testnet";

  connectBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
};

// LOGOUT (DISCONNECT SESSION)
logoutBtn.onclick = () => {
  currentAccount = null;

  document.getElementById("wallet").innerText = "-";
  document.getElementById("balance").innerText = "-";
  document.getElementById("network").innerText = "-";

  connectBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
};

// AUTO LOGOUT IF ACCOUNT CHANGES
if (window.ethereum) {
  ethereum.on("accountsChanged", () => {
    logoutBtn.click();
  });
}

// LOAD LIVE BLOCK NUMBER
(async () => {
  const block = await getLatestBlock();
  document.getElementById("block").innerText = block;
})();
