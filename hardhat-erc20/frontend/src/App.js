import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MyToken from "../artifacts/contracts/MyToken.sol/MyToken.json";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // dán địa chỉ contract của bạn

function App() {
  const [account, setAccount] = useState(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState(0);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  // 🔗 Kết nối MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("⚠️ Vui lòng cài đặt MetaMask!");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  };

  // 📦 Tải thông tin token
  const loadTokenData = async () => {
    if (!account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, MyToken.abi, provider);

    const name = await contract.name();
    const symbol = await contract.symbol();
    const balance = await contract.balanceOf(account);

    setTokenName(name);
    setTokenSymbol(symbol);
    setBalance(ethers.formatUnits(balance, 18));

    // Lấy lịch sử giao dịch
    await loadTransferEvents(contract, provider);
  };

  // 📜 Lấy lịch sử giao dịch từ blockchain
  const loadTransferEvents = async (contract, provider) => {
    const filter = contract.filters.Transfer(); // sự kiện Transfer(from, to, value)
    const events = await contract.queryFilter(filter, 0, "latest");
    const parsed = events.map((ev) => ({
      from: ev.args[0],
      to: ev.args[1],
      value: ethers.formatUnits(ev.args[2], 18),
      txHash: ev.transactionHash,
    }));
    setTransactions(parsed.reverse()); // hiển thị mới nhất lên trên
  };

  // 🚀 Gửi token
  const transferToken = async () => {
    if (!receiver || !amount) return alert("⚠️ Nhập đủ địa chỉ và số lượng token!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MyToken.abi, signer);

    const tx = await contract.transfer(receiver, ethers.parseUnits(amount, 18));
    await tx.wait();
    alert(`✅ Đã chuyển ${amount} ${tokenSymbol} đến ${receiver}`);

    await loadTokenData(); // cập nhật lại sau khi gửi
  };

  // ⛓️ Lắng nghe realtime sự kiện Transfer
  const listenToTransfers = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, MyToken.abi, provider);

    contract.on("Transfer", (from, to, value, event) => {
      const tx = {
        from,
        to,
        value: ethers.formatUnits(value, 18),
        txHash: event.transactionHash,
      };
      setTransactions((prev) => [tx, ...prev]); // thêm vào đầu danh sách
    });
  };

  useEffect(() => {
    if (account) {
      loadTokenData();
      listenToTransfers();
    }
  }, [account]);

  return (
    <div style={{ textAlign: "center", marginTop: "30px", fontFamily: "sans-serif" }}>
      <h1>💎 {tokenName || "MyToken"} DApp</h1>

      {!account ? (
        <button onClick={connectWallet}>🔗 Kết nối ví MetaMask</button>
      ) : (
        <>
          <p>👛 Ví: {account}</p>
          <p>
            {tokenName} ({tokenSymbol}) — Số dư: <b>{balance}</b>
          </p>

          <div style={{ marginTop: "20px" }}>
            <input
              placeholder="Địa chỉ nhận"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              style={{ width: "400px", padding: "8px", margin: "8px" }}
            />
            <br />
            <input
              placeholder="Số lượng token"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "400px", padding: "8px", margin: "8px" }}
            />
            <br />
            <button onClick={transferToken}>🚀 Gửi Token</button>
          </div>

          <hr style={{ margin: "40px 0" }} />

          <h2>📜 Lịch sử giao dịch</h2>
          <table
            border="1"
            cellPadding="8"
            style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#eee" }}>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4">Chưa có giao dịch nào</td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td>{tx.from}</td>
                    <td>{tx.to}</td>
                    <td>{tx.value}</td>
                    <td>
                      <a
                        href={`https://etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tx.txHash.slice(0, 10)}...
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
