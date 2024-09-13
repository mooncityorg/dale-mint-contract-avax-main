import { ethers } from "hardhat";

async function main() {
  const metadata = "https://gateway.pinata.cloud/ipfs/QmZNZXJCodGBArksKDsJ35UV6vCrSQ1Tsr9CCRKYe1rJMM"
  const usdcTokenAddress = "0x5425890298aed601595a70AB815c96711a31Bc65";

  const FactoryNFT = await ethers.getContractFactory("FactoryNFT");
  const factoryNFT = await FactoryNFT.deploy(metadata, usdcTokenAddress)
  await factoryNFT.deployed()

  console.log("Contract deployed to address: ", factoryNFT.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
