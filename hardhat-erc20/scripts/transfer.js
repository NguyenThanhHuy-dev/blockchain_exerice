// scripts/transfer.js
const hre = require("hardhat");

async function main() {
  const [owner, addr1] = await hre.ethers.getSigners();
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.attach("0x5fbdb2315678afecb367f032d93f642f64180aa3"); // địa chỉ contract

  const tx = await token.transfer(addr1.address, ethers.parseUnits("100", 18));
  await tx.wait();
  console.log("✅ Đã chuyển 100 HUY token tới:", addr1.address);
}

main().catch(console.error);
