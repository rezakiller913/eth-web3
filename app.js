function App() {
  return (
    <div>
      <h1>✅ React BERHASIL TAMPIL</h1>
      <p>Jika kamu melihat ini, deploy sudah BENAR.</p>
      <button onClick={() => alert("React jalan!")}>
        Test Button
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

