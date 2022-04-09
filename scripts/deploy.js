const { ethers } = require("hardhat");

async function main() {
  const [deployer, beneficiary] = await ethers.getSigners();

  const MockTokenContract = await ethers.getContractFactory("MockToken");
  const MockToken = await MockTokenContract.deploy("Token", "TKN", 1000000);

  await MockToken.deployed();

  console.log("MockToken deployed to:", MockToken.address);

  const VestingWalletContract = await ethers.getContractFactory(
    "VestingWallet"
  );
  const VestingWallet = await VestingWalletContract.deploy(
    MockToken.address,
    beneficiary.address,
    Math.ceil(Date.now() / 1000),
    [1000, 3000, 6000]
  );

  await VestingWallet.deployed();

  console.log("VestingWallet deployed to:", VestingWallet.address);

  const vestedAmount = "13125300000000";
  await MockToken.transfer(VestingWallet.address, vestedAmount);
  console.log(`MockToken tranfer ${vestedAmount} to VestingWallet`);

  const reserves1 = await VestingWallet.reserves();
  console.log("Initial: ", reserves1.toString());

  await ethers.provider.send("evm_increaseTime", [2592000]);
  await ethers.provider.send("evm_mine");

  await VestingWallet.release();

  const reserves2 = await VestingWallet.reserves();
  console.log("After 1 month: ", reserves2.toString());

  // await ethers.provider.send("evm_increaseTime", [2592000]);
  // await ethers.provider.send("evm_mine");

  // await VestingWallet.release();

  // const reserves3 = await VestingWallet.reserves();
  // console.log("After 2 months: ", reserves3.toString());

  await ethers.provider.send("evm_increaseTime", [2592000]);
  await ethers.provider.send("evm_mine");

  await VestingWallet.release();

  const reserves3 = await VestingWallet.reserves();
  console.log("After 2 months: ", reserves3.toString());

  const balance = await MockToken.balanceOf(beneficiary.address);

  console.log("Beneficiary balance: ", balance.toString());

  // await VestingWallet.release();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
