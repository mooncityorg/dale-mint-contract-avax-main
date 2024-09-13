import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { FactoryNFT } from "../typechain-types";
import Web3 from 'web3';
const web3 = new Web3();

describe("Minting the token and returning it", function () {
  let factoryContract: FactoryNFT
  let account0: Signer, account1: Signer
  // const discordId = "admin#123"
  const metadata = "https://bafybeifqmgyfy4by3gpms5sdv3ft3knccmjsqxfqquuxemohtwfm7y7nwa.ipfs.dweb.link/metadata.json";
  const avaxTokenAddress = "0x1ce0c2827e2ef14d5c4f29a091d735a204794041";

  beforeEach(async function () {
    [account0, account1] = await ethers.getSigners()
    const FactoryContract = await ethers.getContractFactory("FactoryNFT")
    factoryContract = await FactoryContract.deploy(metadata, avaxTokenAddress)
  })

  it("Should tokenId start from 1 and auto increment", async function () {
    const address0 = await account0.getAddress()
    console.log("$$$", address0)

    await factoryContract.mintToken(5)
    expect(await factoryContract.ownerOf(3)).to.equal(address0)
    expect(await factoryContract.balanceOf(address0)).to.equal(5)
  })

  it("Should the contract be able to mint with event", async function () {
    const transaction = await factoryContract.mintToken(6);
    const tx = await transaction.wait()
    let topic = tx.logs[6].topics.slice(1,)

    let result = web3.eth.abi.decodeLog([{
      type: 'address',
      name: 'creator',
    },
    {
      type: 'uint256',
      name: 'mintedNum',
      indexed: true
    },
    {
      type: 'uint256',
      name: 'remainedNum',
      indexed: true
    }
    ],
      tx.logs[6].data,
      topic
    )
    console.log('Minted token number by this user: ', result.mintedNum)
    console.log('Remained Token Number: ', result.remainedNum)
  })

  it("Should return the remained Mints and walletsMints", async function () {
    const address0 = await account0.getAddress()

    await factoryContract.mintToken(501)
    await factoryContract.connect(account1).mintToken(20)
    const mintNumber = await factoryContract.balanceOf(address0)
    console.log("$$$", mintNumber)
    const remainedNumber = await factoryContract.getRemainedMints()
    console.log("$$$$$$$", remainedNumber)
  })
})
