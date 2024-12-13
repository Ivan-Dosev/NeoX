const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenSwap", function () {
  let TokenSwap;
  let tokenSwap;
  let tokenA;
  let tokenB;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Deploy mock ERC20 tokens for testing
    const MockToken = await ethers.getContractFactory("MockERC20");
    tokenA = await MockToken.deploy("Token A", "TKNA");
    tokenB = await MockToken.deploy("Token B", "TKNB");
    await tokenA.deployed();
    await tokenB.deployed();

    // Deploy TokenSwap contract
    TokenSwap = await ethers.getContractFactory("TokenSwap");
    [owner, addr1, addr2] = await ethers.getSigners();
    tokenSwap = await TokenSwap.deploy(tokenA.address, tokenB.address);
    await tokenSwap.deployed();
  });

  it("Should set the right token addresses", async function () {
    expect(await tokenSwap.tokenA()).to.equal(tokenA.address);
    expect(await tokenSwap.tokenB()).to.equal(tokenB.address);
  });

  // Add more tests as needed
}); 