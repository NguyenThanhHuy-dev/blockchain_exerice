// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    uint256 public feePercent; // Phí marketplace (VD: 250 = 2.5%)
    address public feeRecipient; // Địa chỉ ví nhận phí

    struct Listing {
        address seller;
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event ItemListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event ItemCancelled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);
    event ItemSold(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);

    constructor(uint256 _feePercent) {
        feePercent = _feePercent;
        feeRecipient = msg.sender;
    }

    function listItem(address nftAddress, uint256 tokenId, uint256 price) external {
        require(price > 0, "Gia phai lon hon 0");
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Khong phai chu so huu");
        require(nft.isApprovedForAll(msg.sender, address(this)) || nft.getApproved(tokenId) == address(this),
            "Marketplace chua duoc phep");

        listings[nftAddress][tokenId] = Listing(msg.sender, nftAddress, tokenId, price, true);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.active, "NFT chua duoc list");
        require(listing.seller == msg.sender, "Khong phai chu so huu");
        listing.active = false;
        emit ItemCancelled(msg.sender, nftAddress, tokenId);
    }

    function buyItem(address nftAddress, uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.active, "NFT khong duoc list");
        require(msg.value >= listing.price, "So tien khong du");

        uint256 feeAmount = (listing.price * feePercent) / 10000;
        uint256 sellerAmount = listing.price - feeAmount;

        // Chuyển tiền
        payable(listing.seller).transfer(sellerAmount);
        payable(feeRecipient).transfer(feeAmount);

        // Chuyển NFT
        IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);

        listing.active = false;
        emit ItemSold(msg.sender, nftAddress, tokenId, listing.price);
    }

    function setMarketplaceFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Phi toi da 10%");
        feePercent = newFeePercent;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Dia chi khong hop le");
        feeRecipient = newRecipient;
    }
}
