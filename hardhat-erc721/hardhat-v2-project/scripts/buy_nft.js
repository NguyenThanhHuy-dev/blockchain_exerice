const { ethers } = require("hardhat");

const MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TOKEN_ID = 1;
const PRICE = ethers.parseEther("0.05");

async function main() {
  const [, buyer] = await ethers.getSigners();
  console.log("Người mua:", buyer.address);

  // Dùng attach() thay cho getContractAt() để tránh lỗi resolveName
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = Marketplace.attach(MARKETPLACE_ADDRESS);

  console.log("Đang mua NFT...");

  const tx = await marketplace
    .connect(buyer)
    .buyItem(NFT_ADDRESS, TOKEN_ID, { value: PRICE });

  await tx.wait();

  console.log("-------------------------------------");
  console.log(`NFT #${TOKEN_ID} đã được mua thành công!`);
  console.log(`Người mua: ${buyer.address}`);
  console.log(`Transaction hash: ${tx.hash}`);
  console.log("-------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
