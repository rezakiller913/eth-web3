const { useState, useEffect, useRef } = React;

function App() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [price, setPrice] = useState("-");
  const [change, setChange] = useState("-");
  const [range, setRange] = useState("histohour");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData(type) {
    setLoading(true);
    setError(null);

    try {
      const url =
        `https://min-api.cryptocompare.com/data/v2/${type}` +
        `?fsym=ETH&tsym=USD&limit=100`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.Response !== "Success") {
        throw new Error("API Error");
      }

      const data = json.Data.Data;
      const prices = data.map(d => d.close);
      const labels = data.map(d =>
        new Date(d.time * 1000).toLocaleTimeString()
      );

      const first = prices[0];
      const last = prices[prices.length - 1];

      setPrice(`$${last.toFixed(2)}`);
      setChange((((last - first) / first) * 100).toFixed(2));

      renderChart(labels, prices);
    } catch (err) {
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  }

  function renderChart(labels, prices) {
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
          backgroundColor: "rgba(239,68,68,0.15)",
          pointRadius: 0,
          tension: 0.35,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { ticks: { color: "#9ca3af" } }
        }
      }
    });
  }

  useEffect(() => {
    loadData(range);
  }, [range]);

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
        {loading && <div style={styles.center}>Loading chart…</div>}
        {error && <div style={styles.center}>{error}</div>}
        <canvas ref={canvasRef}></canvas>
      </div>

      <div style={styles.buttons}>
        <button onClick={() => setRange("histohour")} style={styles.btn}>24H</button>
        <button onClick={() => setRange("histoday")} style={styles.btn}>7D</button>
      </div>

      <p style={styles.note}>
        Data source: CryptoCompare • React ETH Dashboard
      </p>
    </div>
  );
}

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
    borderRadius: "14px"
  },
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.7
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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
