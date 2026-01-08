const { useState, useEffect } = React;
const { motion } = window["framer-motion"];

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  async function connect() {
    const [addr] = await ethereum.request({
      method: "eth_requestAccounts"
    });
    setAccount(addr);

    const balHex = await ethereum.request({
      method: "eth_getBalance",
      params: [addr, "latest"]
    });
    setBalance((parseInt(balHex, 16) / 1e18).toFixed(4));
  }

  function logout() {
    setAccount(null);
    setBalance(null);
  }

  return (
    <div>
      <nav>
        <h2>⚡ React Web3 Dashboard</h2>
        {!account ? (
          <button onClick={connect}>Connect</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: 400, margin: "40px auto" }}
      >
        <h3>Wallet</h3>
        <p>{account || "-"}</p>

        <h3>Balance</h3>
        <p>{balance ? balance + " ETH" : "-"}</p>
      </motion.div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
