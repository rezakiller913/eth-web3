const { useState, useEffect, useRef } = React;

function App() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("-");
  const [change, setChange] = useState("-");
  const [days, setDays] = useState(1);

  // =========================
  // FETCH + RENDER CHART
  // =========================
  async function loadData(range) {
    setLoading(true);

    const url =
      `https://api.coingecko.com/api/v3/coins/ethereum/market_chart` +
      `?vs_currency=usd&days=${range}&interval=hourly`;

    const res = await fetch(url);
    const data = await res.json();

    const prices = data.prices.map(p => p[1]);
    const labels = data.prices.map(p =>
      new Date(p[0]).toLocaleString()
    );

    const first = prices[0];
    const last = prices[prices.length - 1];

    setPrice(`$${last.toFixed(2)}`);
    setChange((((last - first) / first) * 100).toFixed(2));

    renderChart(labels, prices);
    setLoading(false);
  }

  // =========================
  // CHART RENDER (SAFE)
  // =========================
  function renderChart(labels, prices) {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          data: prices,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.12)",
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { display: false },
          y: {
            ticks: { color: "#9ca3af" },
            grid: { color: "#1f2937" }
          }
        }
      }
    });
  }

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    loadData(days);
  }, [days]);

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>Ethereum (ETH)</h1>
        <div>
          <div style={styles.price}>{price}</div>
          <div style={{
            color: change >= 0 ? "#22c55e" : "#ef4444"
          }}>
            {change}% (24h)
          </div>
        </div>
      </div>

      <div style={styles.chartBox}>
        {loading && <div style={styles.loading}>Loading chart…</div>}
        <canvas ref={canvasRef}></canvas>
      </div>

      <div style={styles.buttons}>
        <Btn label="24H" onClick={() => setDays(1)} />
        <Btn label="7D" onClick={() => setDays(7)} />
        <Btn label="30D" onClick={() => setDays(30)} />
      </div>

      <p style={styles.note}>
        Data source: CoinGecko • React ETH Dashboard
      </p>
    </div>
  );
}

function Btn({ label, onClick }) {
  return (
    <button onClick={onClick} style={styles.btn}>
      {label}
    </button>
  );
}

// =========================
// STYLES
// =========================
const styles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "30px",
    color: "#e5e7eb",
    fontFamily: "Arial"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  price: {
    fontSize: "32px",
    fontWeight: "bold"
  },
  chartBox: {
    position: "relative",
    height: "360px",
    background: "#020617",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 0 40px rgba(0,0,0,.4)"
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.6
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    gap: "10px"
  },
  btn: {
    padding: "8px 14px",
    background: "#111827",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
    borderRadius: "6px",
    cursor: "pointer"
  },
  note: {
    marginTop: "20px",
    opacity: 0.6
  }
};

// =========================
// RENDER
// =========================
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
