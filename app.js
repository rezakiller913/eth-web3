const { useState, useEffect, useRef } = React;

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState("-");
  const priceChartRef = useRef(null);
  const balanceChartRef = useRef(null);
  let priceChart, balanceChart;

  // ======================
  // CONNECT WALLET
  // ======================
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask tidak terdeteksi");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts"
    });

    const addr = accounts[0];
    setAccount(addr);

    const balHex = await ethereum.request({
      method: "eth_getBalance",
      params: [addr, "latest"]
    });

    const ethBalance = parseInt(balHex, 16) / 1e18;
    setBalance(ethBalance.toFixed(4));

    const chainId = await ethereum.request({
      method: "eth_chainId"
    });

    setNetwork(chainId === "0x1" ? "Ethereum Mainnet" : "Testnet");

    updateBalanceChart(ethBalance);
  }

  // ======================
  // LOGOUT
  // ======================
  function logout() {
    setAccount(null);
    setBalance(null);
    setNetwork("-");
  }

  // ======================
  // CHART INIT
  // ======================
  useEffect(() => {
    // ETH PRICE CHART
    priceChart = new Chart(priceChartRef.current, {
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

    // BALANCE CHART
    balanceChart = new Chart(balanceChartRef.current, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          label: "Wallet Balance (ETH)",
          data: [],
          borderColor: "#38bdf8",
          tension: 0.4
        }]
      }
    });

    loadPrice(priceChart);

    // cleanup
    return () => {
      priceChart.destroy();
      balanceChart.destroy();
    };
  }, []);

  // ======================
  // UPDATE BALANCE CHART
  // ======================
  function updateBalanceChart(value) {
    const chart = balanceChartRef.current._chart;
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(value);
    chart.update();
  }

  // ======================
  // LOAD ETH PRICE
  // ======================
  async function loadPrice(chart) {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await res.json();

    chart.data.labels.push("Now");
    chart.data.datasets[0].data.push(data.ethereum.usd);
    chart.update();
  }

  // ======================
  // UI
  // ======================
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>⚡ Web3 Crypto Dashboard</h1>

      <div style={styles.actions}>
        {!account ? (
          <button style={styles.btn} onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <button style={styles.btnDanger} onClick={logout}>
            Logout
          </button>
        )}
      </div>

      <div style={styles.grid}>
        <Card title="Wallet" value={account || "-"} />
        <Card title="ETH Balance" value={balance ? balance + " ETH" : "-"} />
        <Card title="Network" value={network} />
      </div>

      <div style={styles.charts}>
        <div style={styles.chartBox}>
          <h3>ETH Price</h3>
          <canvas ref={priceChartRef}></canvas>
        </div>

        <div style={styles.chartBox}>
          <h3>Wallet Balance</h3>
          <canvas ref={balanceChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

// ======================
// CARD COMPONENT
// ======================
function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <span style={styles.cardTitle}>{title}</span>
      <p style={styles.cardValue}>{value}</p>
    </div>
  );
}

// ======================
// STYLES
// ======================
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #0f172a, #020617)",
    color: "#e5e7eb",
    padding: "40px",
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#38bdf8"
  },
  actions: {
    textAlign: "center",
    marginBottom: "30px"
  },
  btn: {
    padding: "12px 20px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  btnDanger: {
    padding: "12px 20px",
    background: "#ef4444",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  card: {
    background: "rgba(2,6,23,.7)",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 0 25px rgba(56,189,248,.15)"
  },
  cardTitle: {
    fontSize: "0.9rem",
    opacity: 0.7
  },
  cardValue: {
    marginTop: "10px",
    wordBreak: "break-all"
  },
  charts: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px"
  },
  chartBox: {
    background: "rgba(2,6,23,.7)",
    padding: "20px",
    borderRadius: "16px"
  }
};

// ======================
// RENDER
// ======================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Dashboard />);
