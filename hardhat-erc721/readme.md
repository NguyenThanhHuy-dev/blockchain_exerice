# 🖼️ Dự án Quản lý NFT (ERC-721 Enumerable)

Dự án **Web3 DApp** hoàn chỉnh, gồm:
- **Smart Contract (Backend)** viết bằng Solidity & Hardhat.
- **Giao diện React (Frontend)** hiện đại, tương tác trực tiếp với blockchain.

Ứng dụng cho phép người dùng:
- 🚀 **Triển khai (Deploy)** bộ sưu tập NFT (ERC-721).
- 🎨 **Mint (đúc)** NFT mới bằng metadata từ **IPFS**.
- 👤 **Xem danh sách NFT** mình sở hữu (dùng `ERC721Enumerable`).
- 🔁 **Chuyển NFT** cho tài khoản khác một cách an toàn.

---

## ⚙️ Công nghệ sử dụng

### 🧱 Backend (Smart Contract)
| Công nghệ | Mô tả |
|------------|--------|
| **Solidity (v0.8.9)** | Ngôn ngữ lập trình Smart Contract. |
| **Hardhat (v2)** | Công cụ phát triển, biên dịch, và deploy. |
| **Ethers.js (v6)** | Tương tác với blockchain từ JS. |
| **OpenZeppelin (v4.9)** | Thư viện ERC-721, Enumerable, URIStorage. |

### 💻 Frontend (Giao diện Web)
| Công nghệ | Mô tả |
|------------|--------|
| **React (v18)** | Xây dựng giao diện người dùng. |
| **Vite** | Build frontend cực nhanh. |
| **CSS** | Giao diện dark-mode trực quan, gọn gàng. |

---

## 📁 Cấu trúc thư mục

```bash
blockchain_exercise/hardhat-erc721/
│
├── hardhat-v2-project/         # 🧱 Backend (Smart Contract)
│   ├── contracts/
│   │   └── MyNFT.sol           # Contract chính (ERC-721 Enumerable)
│   ├── scripts/
│   │   ├── deploy.js           # Script deploy contract
│   │   └── mint.js             # (Tùy chọn, dùng khi cần mint thủ công)
│   ├── artifacts/
│   │   └── contracts/MyNFT.sol/MyNFT.json  # File ABI cho frontend
│   ├── hardhat.config.js
│   └── package.json
│
└── nft-frontend/               # 💻 Frontend (React DApp)
    ├── src/
    │   ├── MyNFT.json          # ABI copy từ backend
    │   ├── App.jsx             # Giao diện chính
    │   └── index.css
    ├── package.json
    └── index.html
```
##  Hướng dẫn Cài đặt và Chạy Dự án
### 🪄 Bước 1: Chuẩn bị môi trường

Cài Node.js (phiên bản ≥ 18).
Kiểm tra bằng:
node -v
Cài đặt ví MetaMask trên trình duyệt (Chrome, Firefox, Brave, ...).
Clone dự án:
git clone https://github.com/<your-repo>/hardhat-erc721.git
cd hardhat-erc721

### ⚙️ Bước 2: Cài đặt Backend (Hardhat)
# Di chuyển vào thư mục backend
cd hardhat-v2-project

# Cài đặt các thư viện cần thiết
npm install

### 💻 Bước 3: Cài đặt Frontend (React)
# Mở terminal khác và di chuyển vào thư mục frontend
cd nft-frontend

# Cài đặt các thư viện frontend
npm install

# Copy file ABI từ backend sang React
cp ../hardhat-v2-project/artifacts/contracts/MyNFT.sol/MyNFT.json ./src/

## 🚀 Chạy Dự án
### 🧱 Bước 4: Khởi chạy Blockchain cục bộ

Mở terminal đầu tiên và chạy:

cd hardhat-v2-project
npx hardhat node


Lệnh này sẽ tạo 20 tài khoản thử nghiệm và chạy blockchain tại:
http://127.0.0.1:8545

⚠️ Lưu ý: Giữ terminal này luôn mở trong suốt quá trình chạy dự án.

### 📦 Bước 5: Deploy Smart Contract

Mở terminal thứ hai:

cd hardhat-v2-project

# Biên dịch contract
npx hardhat compile

# Deploy contract lên node local
npx hardhat run scripts/deploy.js --network localhost


Sau khi deploy thành công, bạn sẽ thấy thông báo:

MyNFT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3


Hãy copy địa chỉ contract này (ví dụ: 0x5FbD...aa3).

### 🧭 Bước 6: Cập nhật địa chỉ Contract trong Frontend

Mở file:

nft-frontend/src/App.jsx


Tìm dòng:

const CONTRACT_ADDRESS = "0x...";


Và thay bằng địa chỉ contract bạn vừa deploy.

### 🧱 Bước 7: Chuẩn bị Metadata (IPFS)

Truy cập Pinata.cloud
 hoặc dịch vụ tương tự.

Upload ảnh NFT (ví dụ: nft.png).

Copy CID của ảnh (ví dụ: Qm...abc).

Tạo file metadata.json với nội dung:

{
  "name": "My Demo NFT",
  "description": "NFT được mint từ DApp!",
  "image": "ipfs://Qm...abc"
}


Upload metadata.json lên Pinata và lấy CID của file JSON (ví dụ: Qm...xyz).

Token URI sẽ là:

ipfs://Qm...xyz

### 🌐 Bước 8: Chạy Ứng dụng Web

Mở terminal frontend:

cd nft-frontend
npm run dev


Giao diện sẽ chạy tại:
👉 http://localhost:5173

### 🔗 Bước 9: Kết nối MetaMask với Mạng Local

Mở MetaMask → Add network manually:

Network Name: Hardhat Local
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH


Import tài khoản test:

Quay lại terminal Hardhat node.

Copy private key của Account #0.

Trong MetaMask → Import account → Dán private key.

### 🎨 Bước 10: Mint NFT Mới

Trong ứng dụng web, nhập Token URI:

ipfs://Qm...xyz


Nhấn "Mint NFT mới".

Xác nhận giao dịch trên MetaMask.

Đợi giao dịch hoàn tất → NFT của bạn sẽ được mint thành công!

### 👀 Bước 11: Xem & Quản lý NFT

Nhấn "Tải danh sách NFT" → hiển thị ảnh và metadata NFT bạn sở hữu.

Để chuyển NFT:

Import thêm Account #1 trong MetaMask.

Copy địa chỉ Account #1.

Trong web app, nhập:

Token ID: 1

Địa chỉ người nhận: (địa chỉ account #1)

Nhấn "Chuyển NFT" → xác nhận trên MetaMask.

Chuyển sang Account #1 và tải lại danh sách NFT → NFT đã được chuyển thành công ✅

## 💡 Gợi ý Nâng Cấp

🌐 Deploy lên testnet Sepolia/Base Goerli thay vì mạng local.

🔐 Tự động kết nối ví MetaMask khi reload trang.

🖼️ Dùng TailwindCSS hoặc shadcn/ui để cải thiện UI.

🧵 Tích hợp API Pinata để upload IPFS trực tiếp từ web.
