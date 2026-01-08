// React App (NO ERROR, NO BLANK)

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      background: "#020617",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 0 30px rgba(56,189,248,0.2)"
    }}>
      <h1 style={{ color: "#38bdf8" }}>
        ✅ React Berhasil Tampil
      </h1>

      <p>
        Jika kamu melihat halaman ini, berarti:
      </p>

      <ul style={{ textAlign: "left" }}>
        <li>✔ React via CDN bekerja</li>
        <li>✔ Babel bekerja</li>
        <li>✔ Netlify deploy sukses</li>
        <li>✔ Tidak blank putih</li>
      </ul>

      <hr style={{ margin: "20px 0", borderColor: "#1e293b" }} />

      <p>Test interaksi React:</p>

      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: "10px 16px",
          background: "#38bdf8",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Klik: {count}
      </button>

      <p style={{ marginTop: "20px", opacity: 0.7 }}>
        Langkah selanjutnya: Web3, animasi, chart, dashboard 🚀
      </p>
    </div>
  );
}

// RENDER (WAJIB)
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
