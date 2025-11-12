const { ethers } = require("hardhat");

async function main() {
  console.log("Triển khai MyNFT...");
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy();
  console.log(`✅ MyNFT: ${myNFT.target}`);

  console.log("Triển khai Marketplace...");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const market = await Marketplace.deploy(250); // 2.5% phí
  console.log(`✅ Marketplace: ${market.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
