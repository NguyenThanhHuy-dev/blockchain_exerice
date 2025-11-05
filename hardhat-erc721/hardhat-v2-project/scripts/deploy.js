const { ethers } = require("hardhat");

async function main() {
  // Lấy ContractFactory
  const MyNFT = await ethers.getContractFactory("MyNFT");

  // Deploy
  console.log("Đang triển khai MyNFT...");
  // Lệnh "await deploy()" trong Ethers v6 đã tự động chờ deploy xong
  const myNFT = await MyNFT.deploy();

  // 1. DÒNG NÀY BỊ LỖI -> XÓA NÓ ĐI
  // await myNFT.deployed(); 

  // 2. ĐỊA CHỈ TRONG Ethers v6 LÀ ".target" (không phải ".address")
  console.log(`Contract MyNFT đã được triển khai tại địa chỉ: ${myNFT.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});