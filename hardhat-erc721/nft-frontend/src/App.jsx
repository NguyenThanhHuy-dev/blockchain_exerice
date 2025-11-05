import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFT_ABI from './MyNFT.json'; 

// --- CẤU HÌNH (KHÔNG THAY ĐỔI) ---
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = MyNFT_ABI.abi;
// ---------------

// --- HÀM HELPER (KHÔNG THAY ĐỔI) ---
const resolveIpfsUrl = (ipfsUri) => {
  if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) {
    return ipfsUri;
  }
  const cid = ipfsUri.substring(7);
  return `https://ipfs.io/ipfs/${cid}`; 
};
// -----------------------------------------------------------

function App() {
  // --- LOGIC STATE (Thêm 2 state MỚI) ---
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [myNfts, setMyNfts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  
  // State cho việc Transfer
  const [toAddress, setToAddress] = useState("");
  const [transferTokenId, setTransferTokenId] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  
  // STATE MỚI: Cho việc Mint
  const [mintTokenURI, setMintTokenURI] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  // ------------------------------------

  // --- HÀM LOGIC (connectWallet, disconnectWallet, useEffect... KHÔNG THAY ĐỔI) ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ 
          method: 'wallet_requestPermissions', 
          params: [{ eth_accounts: {} }] 
        });
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const newAccount = await newSigner.getAddress();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
        setProvider(newProvider); setSigner(newSigner); setAccount(newAccount); setContract(newContract);
      } catch (error) { console.error("Lỗi khi yêu cầu quyền kết nối:", error); }
    } else { alert("Vui lòng cài đặt MetaMask!"); }
  };

  const disconnectWallet = () => {
    setProvider(null); setSigner(null); setAccount(null); setContract(null); setMyNfts([]);
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await newProvider.getSigner();
          const newAccount = await newSigner.getAddress();
          const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
          setProvider(newProvider); setSigner(newSigner); setAccount(newAccount); setContract(newContract);
          setMyNfts([]); 
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => { window.ethereum.removeListener('accountsChanged', handleAccountsChanged); };
    }
  }, []);
  
  const fetchMyNfts = async () => {
    // ... (Hàm này giữ nguyên, không thay đổi)
    if (!contract || !account) return;
    setIsFetching(true);
    setMyNfts([]);
    try {
      const balance = await contract.balanceOf(account);
      if (balance.toString() === "0") {
         setIsFetching(false);
         return;
      }
      const nftPromises = [];
      for (let i = 0; i < balance; i++) {
        nftPromises.push(
          (async () => {
            try {
              const tokenId = await contract.tokenOfOwnerByIndex(account, i);
              const tokenURI = await contract.tokenURI(tokenId);
              const metadataUrl = resolveIpfsUrl(tokenURI);
              const response = await fetch(metadataUrl);
              const metadata = await response.json();
              const imageUrl = resolveIpfsUrl(metadata.image);
              return { id: tokenId.toString(), name: metadata.name, imageUrl: imageUrl };
            } catch (error) { return null; }
          })()
        );
      }
      const resolvedNfts = await Promise.all(nftPromises);
      const validNfts = resolvedNfts.filter(nft => nft !== null);
      setMyNfts(validNfts);
    } catch (error) { console.error("Lỗi khi lấy NFT (Enumerable):", error); }
    setIsFetching(false);
  };

  const handleTransfer = async () => {
    // ... (Hàm này giữ nguyên, không thay đổi)
    if (!contract || !toAddress || !transferTokenId) {
      alert("Vui lòng nhập Token ID và Địa chỉ nhận");
      return;
    }
    setIsTransferring(true);
    try {
      const tx = await contract.safeTransferFrom(account, toAddress, transferTokenId);
      await tx.wait();
      alert("Chuyển NFT thành công!");
      fetchMyNfts();
    } catch (error) { console.error("Lỗi khi chuyển NFT:", error); alert("Lỗi khi chuyển NFT!"); }
    setIsTransferring(false);
  };
  
  // --- HÀM MỚI: XỬ LÝ MINT NFT ---
  const handleMint = async () => {
    if (!contract || !mintTokenURI) {
      alert("Vui lòng nhập Token URI (link file JSON từ IPFS)");
      return;
    }
    setIsMinting(true);
    try {
      console.log(`Đang mint NFT với URI: ${mintTokenURI}...`);
      
      // Gọi hàm "mintNFT" của contract
      // Người nhận (recipient) chính là tài khoản đang kết nối (account)
      const tx = await contract.mintNFT(account, mintTokenURI);
      
      console.log("Đang chờ giao dịch...", tx.hash);
      await tx.wait();
      
      console.log("MINT THÀNH CÔNG!");
      alert("Mint NFT mới thành công!");
      
      // Tải lại danh sách NFT sau khi mint
      fetchMyNfts(); 
      
    } catch (error) {
      console.error("Lỗi khi mint NFT:", error);
      alert("Lỗi khi mint NFT!");
    }
    setIsMinting(false);
  };
  // ---------------------------------

  // --- GIAO DIỆN JSX (CẬP NHẬT MAIN CONTENT) ---
  return (
    <div className="app-container">
      {/* Header (Không thay đổi) */}
      <header className="app-header">
        <h1>Ứng dụng Quản lý NFT</h1>
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            Kết nối ví MetaMask
          </button>
        ) : (
          <div className="wallet-controls"> 
            <div className="wallet-info">
              <strong>Đã kết nối:</strong>
              <span>{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span>
            </div>
            <button className="disconnect-btn" onClick={disconnectWallet}>
              Đăng xuất
            </button>
          </div>
        )}
      </header>

      {/* Main Content (Cập nhật) */}
      {account && (
        <main className="main-content">
          
          {/* Cột 1: Danh sách NFT (Không thay đổi) */}
          <section className="card">
            <h2>NFT Của Tôi (Enumerable)</h2>
            <button onClick={fetchMyNfts} disabled={isFetching}>
              {isFetching ? "Đang tải..." : "Tải danh sách NFT"}
            </button>
            <div className="nft-list">
              {myNfts.length > 0 ? (
                myNfts.map(nft => (
                  <div key={nft.id} className="nft-item">
                    <img src={nft.imageUrl} alt={nft.name} className="nft-image" />
                    <div className="nft-info">
                      <strong>{nft.name}</strong> 
                      <span>Token ID: {nft.id}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">
                  {isFetching ? "Đang tải metadata..." : "Bạn không có NFT nào (hoặc chưa tải)."}
                </p>
              )}
            </div>
          </section>
          
          {/* Cột 2: SẼ CHỨA 2 CARD (TRANSFER VÀ MINT) */}
          {/* DÙNG MỘT THẺ DIV "sidebar" MỚI ĐỂ BỌC CỘT 2 */}
          <div className="sidebar">
            {/* Card 2.1: Chuyển NFT (Không thay đổi) */}
            <section className="card">
              <h2>Chuyển NFT</h2>
              <div className="transfer-form">
                <label>Token ID:</label>
                <input 
                  type="text"
                  placeholder="Token ID (ví dụ: 1)"
                  onChange={(e) => setTransferTokenId(e.target.value)}
                />
                <label>Địa chỉ người nhận:</label>
                <input 
                  type="text"
                  placeholder="Địa chỉ (0x...)"
                  onChange={(e) => setToAddress(e.target.value)}
                />
                <button onClick={handleTransfer} disabled={isTransferring}>
                  {isTransferring ? "Đang chuyển..." : "Xác nhận chuyển"}
                </button>
              </div>
            </section>

            {/* CARD MỚI: Mint NFT */}
            <section className="card">
              <h2>Mint NFT Mới</h2>
              <div className="mint-form">
                <label>Token URI (JSON):</label>
                <input 
                  type="text"
                  placeholder="ipfs://Qm..."
                  onChange={(e) => setMintTokenURI(e.target.value)}
                />
                <button onClick={handleMint} disabled={isMinting}>
                  {isMinting ? "Đang mint..." : "Xác nhận Mint"}
                </button>
              </div>
            </section>
          </div> {/* Kết thúc thẻ div "sidebar" */}

        </main>
      )}
    </div>
  );
}

export default App;