import React, { useEffect, useState } from "react";
import Web3 from "web3";
import abi from "./abi.json";

function App() {
  const [account, setAccount] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [newGreeting, setNewGreeting] = useState(""); 
  const [contract, setContract] = useState(null);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // dán từ deployedAddress.txt

  // Kết nối MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        const web3 = new Web3(window.ethereum);
        const instance = new web3.eth.Contract(abi, contractAddress);
        setContract(instance);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Vui lòng cài MetaMask!");
    }
  };

  // Lấy greeting hiện tại
  const loadGreeting = async () => {
    if (contract) {
      const g = await contract.methods.greet().call();
      setGreeting(g);
    }
  };

  // Cập nhật greeting mới
  const updateGreeting = async () => {
    if (contract && account) {
      await contract.methods.setGreeting(newGreeting).send({ from: account });
      loadGreeting();
    }
  };

  useEffect(() => {
    if (contract) loadGreeting();
  }, [contract]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🌐 Simple Web3 DApp - Greeter</h2>

      {!account ? (
        <button onClick={connectWallet}>🔗 Kết nối MetaMask</button>
      ) : (
        <div>
          <p>🧾 Tài khoản: {account}</p>
          <p>💬 Greeting hiện tại: {greeting}</p>

          <input
            type="text"
            placeholder="Nhập greeting mới"
            value={newGreeting}
            onChange={(e) => setNewGreeting(e.target.value)}
          />
          <button onClick={updateGreeting}>Cập nhật</button>
        </div>
      )}
    </div>
  );
}

export default App;
