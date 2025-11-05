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
