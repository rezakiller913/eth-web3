const connectBtn = document.getElementById("connectBtn");
const logoutBtn = document.getElementById("logoutBtn");

let balanceHistory = [];
let balanceChart, priceChart;

// ===== ETH RPC =====
async function getLatestBlock() {
  const res = await fetch("https://eth.llamarpc.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1
    })
  });
  const data = await res.json();
  return parseInt(data.result, 16);
}

// ===== PRICE API =====
async function loadEthPrice() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  const data = await res.json();
  return data.ethereum.usd;
}

// ===== CHARTS =====
function initCharts() {
  balanceChart = new Chart(document.getElementById("balanceChart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "ETH Balance",
        data: [],
        borderColor: "#38bdf8",
        tension: 0.4
      }]
    }
  });

  priceChart = new Chart(document.getElementById("priceChart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "ETH Price (USD)",
        data: [],
        borderColor: "#22c55e",
        tension: 0.4
      }]
    }
  });
}

// ===== CONNECT =====
connectBtn.onclick = async () => {
  const [account] = await ethereum.request({
    method: "eth_requestAccounts"
  });

  document.getElementById("wallet").innerText = account;

  const balHex = await ethereum.request({
    method: "eth_getBalance",
    params: [account, "latest"]
  });

  const balance = parseInt(balHex, 16) / 1e18;
  document.getElementById("balance").innerText =
    balance.toFixed(4) + " ETH";

  balanceHistory.push(balance);
  balanceChart.data.labels.push(balanceHistory.length);
  balanceChart.data.datasets[0].data = balanceHistory;
  balanceChart.update();

  const chainId = await ethereum.request({ method: "eth_chainId" });
  document.getElementById("network").innerText =
    chainId === "0x1" ? "Ethereum Mainnet" : "Testnet";

  connectBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
};

// ===== LOGOUT =====
logoutBtn.onclick = () => {
  document.getElementById("wallet").innerText = "-";
  document.getElementById("balance").innerText = "-";
  document.getElementById("network").innerText = "-";

  connectBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
};

// ===== INIT =====
(async () => {
  initCharts();

  document.getElementById("block").innerText =
    await getLatestBlock();

  const price = await loadEthPrice();
  priceChart.data.labels.push("Now");
  priceChart.data.datasets[0].data.push(price);
  priceChart.update();
})();
