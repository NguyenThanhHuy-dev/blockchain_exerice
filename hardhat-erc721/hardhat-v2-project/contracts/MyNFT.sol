// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// 1. Import CẢ 3 contract (base, enumerable, storage)
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; 

// 2. Kế thừa từ CẢ 3
contract MyNFT is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("My Awesome NFT", "MANFT") {}

    // Đã sửa lỗi warning (dùng _tokenURI)
    function mintNFT(address recipient, string memory _tokenURI)
        public
        returns (uint256)
    {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI); 
        return newItemId;
    }

    // ---- CÁC HÀM OVERRIDE BẮT BUỘC ----

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev SỬA LỖI Ở ĐÂY: Thêm "ERC721URIStorage" vào danh sách
     * Xung đột giữa: Cả 3 contract
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}