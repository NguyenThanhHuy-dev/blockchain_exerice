const { ethers } = require("hardhat");

const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const TOKEN_ID = 1;

async function main() {
  const [seller, buyer] = await ethers.getSigners();

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = MyNFT.attach(NFT_ADDRESS);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = Marketplace.attach(MARKETPLACE_ADDRESS);

  // 🧾 Kiểm tra chủ sở hữu hiện tại của NFT
  const owner = await myNFT.ownerOf(TOKEN_ID);
  console.log(`📦 NFT #${TOKEN_ID} hiện đang thuộc về: ${owner}`);

  // 🧾 Kiểm tra xem NFT đó còn đang list bán không
  try {
    const listing = await marketplace.listings(NFT_ADDRESS, TOKEN_ID);
    console.log(`💰 Giá đang list: ${ethers.formatEther(listing.price)} ETH`);
    console.log(`👤 Người bán: ${listing.seller}`);
    if (listing.sold) console.log("✅ NFT này đã được bán rồi!");
    else console.log("🕒 NFT vẫn đang được rao bán!");
  } catch (err) {
    console.log("⚠️ NFT không còn trong danh sách Marketplace (đã bán).");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
