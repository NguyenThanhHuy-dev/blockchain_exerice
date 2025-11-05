const { ethers } = require("hardhat");

// --- THAY THẾ CÁC GIÁ TRỊ NÀY ---
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const TOKEN_URI = "ipfs://bafkreihvpnvoff2owbzciuibts2hovihs72ny5sbw5ac7kbntcshydeazi"; // Dùng lại link IPFS cũ của bạn
// ---

async function main() {
  // Lấy signer (tài khoản)
  const [signer] = await ethers.getSigners();
  console.log("Sử dụng tài khoản:", signer.address);

  // --- THAY ĐỔI QUAN TRỌNG TRONG Ethers v6 ---
  // Chúng ta dùng "getContractAt" để kết nối với contract đã deploy
  // (Thay thế cho .getContractFactory và .attach)
  console.log("Đang kết nối tới contract tại:", CONTRACT_ADDRESS);
  const myNFT = await ethers.getContractAt("MyNFT", CONTRACT_ADDRESS, signer);
  // ----------------------------------------

  console.log("Đang gọi hàm mintNFT...");

  // Gọi hàm (với signer đã được đính kèm)
  const tx = await myNFT.mintNFT(signer.address, TOKEN_URI);

  console.log("Đang chờ giao dịch hoàn tất...", tx.hash);
  await tx.wait(); // Chờ giao dịch

  console.log("-----------------------------------------");
  console.log(`ĐÃ MINT THÀNH CÔNG NFT!`);
  console.log(`Gửi tới: ${signer.address}`);
  console.log(`Transaction hash: ${tx.hash}`);
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});