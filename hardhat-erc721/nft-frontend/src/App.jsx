import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MyNFT from "./MyNFT.json";
import Marketplace from "./Marketplace.json";
import { MYNFT_ADDRESS, MARKETPLACE_ADDRESS } from "./config";
import './index.css'

// (Các hàm khác giữ nguyên: resolveIpfsUrl)
const resolveIpfsUrl = (ipfsUri) => {
  if (!ipfsUri || !ipfsUri.startsWith("ipfs://")) return ipfsUri;
  return `https://ipfs.io/ipfs/${ipfsUri.substring(7)}`;
};


function App() {
  const [account, setAccount] = useState(null);
  const [myNfts, setMyNfts] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  const [price, setPrice] = useState("");

  // (useEffect giữ nguyên)
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log("Người dùng đã ngắt kết nối MetaMask.");
        disconnectWallet(); // Gọi hàm disconnect mới
      } else if (accounts[0] !== account) {
        window.location.reload();
      }
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [account]);

  // (connectWallet giữ nguyên)
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
    const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(address);
    await loadMyNFTs(address); 
    await loadMarketItems();
  };

  // --- HÀM ĐƯỢC CẬP NHẬT ---
  // Thêm 'async' và yêu cầu 'wallet_revokePermissions'
  const disconnectWallet = async () => {
    // Bước 1: Gửi yêu cầu thu hồi quyền đến MetaMask
    if (window.ethereum && window.ethereum.request) {
      try {
        // Yêu cầu MetaMask "quên" trang web này
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        console.log("Đã thu hồi quyền MetaMask.");
      } catch (error) {
        // Người dùng có thể từ chối yêu cầu thu hồi, v.v.
        console.error("Không thể thu hồi quyền:", error);
      }
    }

    // Bước 2: Dọn dẹp state của React (luôn thực hiện)
    setAccount(null);
    setMyNfts([]);
    setMarketItems([]);
    setPrice("");
  };

  // (getSigner giữ nguyên)
  const getSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
  };

  // (Các hàm logic khác: loadMyNFTs, listNFT, loadMarketItems, buyNFT giữ nguyên)
  // ... (giữ nguyên code của bạn cho các hàm này) ...
  // Lấy NFT người dùng sở hữu
  const loadMyNFTs = async (currentAccount) => {
    if (!currentAccount) return; 
    const signer = await getSigner();
    const nft = new ethers.Contract(MYNFT_ADDRESS, MyNFT.abi, signer);
    const balance = await nft.balanceOf(currentAccount);
    const items = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await nft.tokenOfOwnerByIndex(currentAccount, i);
      const uri = await nft.tokenURI(tokenId);
      const res = await fetch(resolveIpfsUrl(uri));
      const metadata = await res.json();
      items.push({
        tokenId: tokenId.toString(),
        name: metadata.name,
        image: resolveIpfsUrl(metadata.image),
      });
    }
    setMyNfts(items);
  };
  // List NFT lên marketplace
  const listNFT = async (tokenId) => {
    if (!price) return alert("Nhập giá ETH trước khi list!");
    const signer = await getSigner();
    const nft = new ethers.Contract(MYNFT_ADDRESS, MyNFT.abi, signer);
    const market = new ethers.Contract(MARKETPLACE_ADDRESS, Marketplace.abi, signer);
    const priceWei = ethers.parseEther(price);
    const tx1 = await nft.approve(MARKETPLACE_ADDRESS, tokenId);
    await tx1.wait();
    const tx2 = await market.listItem(MYNFT_ADDRESS, tokenId, priceWei);
    await tx2.wait();
    alert(`✅ NFT #${tokenId} đã được list với giá ${price} ETH`);
    setPrice(""); 
    await loadMarketItems();
    await loadMyNFTs(account); 
  };
  // Lấy danh sách NFT đang được rao bán
  const loadMarketItems = async () => {
    const signer = await getSigner();
    const market = new ethers.Contract(MARKETPLACE_ADDRESS, Marketplace.abi, signer);
    const nft = new ethers.Contract(MYNFT_ADDRESS, MyNFT.abi, signer);
    const items = [];
    for (let i = 1; i <= 10; i++) { 
      const item = await market.listings(MYNFT_ADDRESS, i);
      if (item.active) {
        const uri = await nft.tokenURI(i);
        const res = await fetch(resolveIpfsUrl(uri));
        const metadata = await res.json();
        items.push({
          tokenId: i,
          seller: item.seller,
          price: ethers.formatEther(item.price),
          image: resolveIpfsUrl(metadata.image),
          name: metadata.name,
        });
      }
    }
    setMarketItems(items);
  };
  // Mua NFT
  const buyNFT = async (tokenId, price) => {
    const signer = await getSigner();
    const market = new ethers.Contract(MARKETPLACE_ADDRESS, Marketplace.abi, signer);
    const tx = await market.buyItem(MYNFT_ADDRESS, tokenId, { value: ethers.parseEther(price) });
    await tx.wait();
    alert(`🎉 Mua NFT #${tokenId} thành công!`);
    await loadMarketItems();
    await loadMyNFTs(account); 
  };


  // (Phần JSX return giữ nguyên y hệt)
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-6 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-purple-400">NFT Marketplace (ETH Only)</h1>
        
        {!account ? (
          <button
            onClick={connectWallet}
            className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition"
          >
            Kết nối MetaMask
          </button>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
            <p className="text-sm text-gray-300">
              Đang đăng nhập: <span className="text-purple-400 font-mono text-xs">{account}</span>
            </p>
            <button
              onClick={disconnectWallet} // Nút này giờ sẽ gọi hàm async mới
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </header>

      {/* Nội dung chính (Giữ nguyên) */}
      {account && (
        //... toàn bộ JSX của bạn ...
        <main className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">🎨 NFT Của Tôi</h2>
            {myNfts.length === 0 ? (
              <p className="text-gray-500 italic">Không có NFT nào.</p>
            ) : (
              <div className="flex overflow-x-auto space-x-4 pb-3">
                {myNfts.map((nft) => (
                  <div
                    key={nft.tokenId}
                    className="bg-gray-900 border border-gray-800 rounded-xl shadow-md p-4 w-64 flex-shrink-0"
                  >
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="rounded-lg mb-3 h-56 w-full object-cover"
                    />
                    <h3 className="text-lg font-semibold truncate">{nft.name}</h3>
                    <input
                      type="text"
                      placeholder="Giá (ETH)"
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button
                      onClick={() => listNFT(nft.tokenId)}
                      className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
                    >
                      List NFT
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">🛒 Marketplace</h2>
            {marketItems.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có NFT nào được rao bán.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {marketItems.map((item) => (
                  <div
                    key={item.tokenId}
                    className="bg-gray-900 border border-gray-800 rounded-xl shadow-md p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-lg mb-3 h-56 w-full object-cover"
                    />
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">Giá: {item.price} ETH</p>
                    <p className="text-sm text-gray-500">
                      Người bán: {item.seller.substring(0, 6)}...
                    </p>
                    <button
                      onClick={() => buyNFT(item.tokenId, item.price)}
                      className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
                    >
                      Mua
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;