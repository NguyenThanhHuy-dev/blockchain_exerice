import Web3 from "web3";
import fs from "fs";

async function main() {
  const web3 = new Web3("http://127.0.0.1:8545");

  // Đọc địa chỉ từ file
  const contractAddress = fs.readFileSync("deployedAddress.txt", "utf8").trim();

  const contractJson = JSON.parse(
    fs.readFileSync("./artifacts/contracts/Greeter.sol/Greeter.json", "utf8")
  );

  const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

  const accounts = await web3.eth.getAccounts();
  console.log("🧾 Using account:", accounts[0]);

  const greeting = await contract.methods.greet().call();
  console.log("📢 Greeting hiện tại:", greeting);

  await contract.methods.setGreeting("Xin chào tự động!").send({
    from: accounts[0],
    gas: 100000,
  });

  const newGreeting = await contract.methods.greet().call();
  console.log("✅ Greeting mới:", newGreeting);
}

main().catch(console.error);
