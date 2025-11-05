// scripts/check_balance.js
const hre = require("hardhat");

async function main() {
  const [owner, addr1] = await hre.ethers.getSigners();
  const token = await hre.ethers.getContractAt(
    "MyToken",
    "0x5fbdb2315678afecb367f032d93f642f64180aa3" // địa chỉ contract
  );

  const balance = await token.balanceOf(addr1.address);
  console.log(`💰 Balance of ${addr1.address}:`, hre.ethers.formatUnits(balance, 18), "HUY");
}

main().catch(console.error);
