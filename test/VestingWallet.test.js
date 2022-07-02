const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VestingWallet", function () {
  let VestingWalletContract, vestingWallet;
  let MockTokenContract, mockToken;
  let owner, beneficiary, user1;

  beforeEach(async function () {
    MockTokenContract = await ethers.getContractFactory("MockToken");
    mockToken = await MockTokenContract.deploy("Test token", "TKN", 1000000);
    await mockToken.deployed();

    [owner, beneficiary, user1] = await ethers.getSigners();
  });

  describe("constructor", function () {
    beforeEach(async function () {
      VestingWalletContract = await ethers.getContractFactory("VestingWallet");
      vestingWallet = await VestingWalletContract.deploy(
        mockToken.address,
        beneficiary.address,
        Math.ceil(Date.now() / 1000),
        [1000, 3000, 6000]l
      );
      await mockToken.deployed();
    });

    it("Should deploy", async function () {
      expect(await vestingWallet.address).to.not.equal(
        ethers.constants.AddressZero
      );
    });
  });
});
