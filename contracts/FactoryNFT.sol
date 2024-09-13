// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface USDC {
    function balanceOf(address account) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract FactoryNFT is ERC721, Ownable {
    USDC public usdc;
    address payable public contractOwner;
    uint256 public totalMints = 0;
    uint256 public constant maxSupply = 500;
    string public baseTokenURI;

    mapping(address => uint256) walletMints;

    event NFTMinted(
        address creator,
        uint indexed mintedNum,
        uint indexed remainedNum
    );

    constructor(
        string memory baseURI,
        address usdcContractAddress
    ) ERC721("FactoryNFT", "FTN") {
        contractOwner = payable(msg.sender);
        setBaseURI(baseURI);
        usdc = USDC(usdcContractAddress);
    }

    function safeMint(address _to, uint256 _quantity) internal {
        for (uint i = 0; i < _quantity; i++) {
            uint256 tokenId = totalMints + 1;
            totalMints++;

            _safeMint(_to, tokenId);
        }
    }

    function mintToken(uint256 _quantity) public {
        require(
            totalMints + _quantity <= maxSupply,
            "The number of total mint is exceeded"
        );

        usdc.transferFrom(
            msg.sender,
            address(this),
            (_quantity * 10 ** 6) / 100
        );

        walletMints[msg.sender] += _quantity;
        safeMint(msg.sender, _quantity);

        emit NFTMinted(
            msg.sender,
            walletMints[msg.sender],
            maxSupply - totalMints
        );
    }

    function withdrawFunds() external onlyOwner {
        usdc.transfer(contractOwner, usdc.balanceOf(address(this)));
    }

    function getRemainedMints() public view returns (uint256) {
        return maxSupply - totalMints;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }
}
