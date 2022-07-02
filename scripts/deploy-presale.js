const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const FanbazaPresaleTokenContract = await ethers.getContractFactory(
    "FanbazaPresaleToken"
  );
  const FanbazaPresaleToken = await FanbazaPresaleTokenContract.deploy();

  await FanbazaPresaleToken.deployed();

  console.log("FanbazaPresaleToken deployed to:", FanbazaPresaleToken.address);

  const balance = await FanbazaPresaleToken.balanceOf(deployer.address);
  console.log(balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
