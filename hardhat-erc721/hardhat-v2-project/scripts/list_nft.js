const { ethers } = require("hardhat");

const MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TOKEN_ID = 1;
const PRICE = ethers.parseEther("0.05");

async function main() {
  const [seller] = await ethers.getSigners();
  console.log("Người bán:", seller.address);

  // DÙNG attach() THAY VÌ getContractAt()
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = MyNFT.attach(NFT_ADDRESS);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = Marketplace.attach(MARKETPLACE_ADDRESS);

  console.log("✅ Approving marketplace...");
  const approveTx = await myNFT.connect(seller).approve(MARKETPLACE_ADDRESS, TOKEN_ID);
  await approveTx.wait();

  console.log("✅ Listing NFT...");
  const listTx = await marketplace.connect(seller).listItem(NFT_ADDRESS, TOKEN_ID, PRICE);
  await listTx.wait();

  console.log("-------------------------------------");
  console.log(`NFT #${TOKEN_ID} đã được list với giá ${ethers.formatEther(PRICE)} ETH`);
  console.log("-------------------------------------");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
