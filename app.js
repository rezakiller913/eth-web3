const { useState, useEffect, useRef } = React;

function App() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [price, setPrice] = useState("-");
  const [change, setChange] = useState("-");
  const [range, setRange] = useState(1); // days

  // ======================
  // FETCH DATA
  // ======================
  async function loadChart(days) {
    const url = `
https://api.coingecko.com/api/v3/coins/ethereum/market_chart
?vs_currency=usd&days=${days}&interval=hourly`;

    const res = await fetch(url);
    const data = await res.json();

    const prices = data.prices.map(p => p[1]);
    const labels = data.prices.map(p =>
      new Date(p[0]).toLocaleTimeString()
    );

    const first = prices[0];
    const last = prices[prices.length - 1];
    const changePct = (((last - first) / first) * 100).toFixed(2);

    setPrice(`$${last.toFixed(2)}`);
    setChange(changePct);

    drawChart(labels, prices);
  }

  // ======================
  // DRAW CHART
  // ======================
  function drawChart(labels, prices) {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          data: prices,
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
          backgroundColor: "rgba(239,68,68,0.1)"
        }]
      },
      options: {
        responsive: true,
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

  useEffect(() => {
    loadChart(range);
  }, [range]);

  // ======================
  // UI
  // ======================
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>Ethereum (ETH)</h1>
        <div>
          <div style={styles.price}>{price}</div>
          <div style={{
            color: change > 0 ? "#22c55e" : "#ef4444"
          }}>
            {change}% (24h)
          </div>
        </div>
      </div>

      <div style={styles.chartBox}>
        <canvas ref={chartRef}></canvas>
      </div>

      <div style={styles.buttons}>
        <RangeButton text="24H" days={1} setRange={setRange} />
        <RangeButton text="7D" days={7} setRange={setRange} />
        <RangeButton text="30D" days={30} setRange={setRange} />
      </div>

      <p style={styles.note}>
        Data source: CoinGecko • React Dashboard
      </p>
    </div>
  );
}

// ======================
// RANGE BUTTON
// ======================
function RangeButton({ text, days, setRange }) {
  return (
    <button
      onClick={() => setRange(days)}
      style={styles.rangeBtn}
    >
      {text}
    </button>
  );
}

// ======================
// STYLES
// ======================
const styles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "30px"
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
    background: "#020617",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 0 40px rgba(0,0,0,.4)"
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    gap: "10px"
  },
  rangeBtn: {
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

// ======================
// RENDER
// ======================
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
