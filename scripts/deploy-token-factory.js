const { ethers } = require("hardhat");

async function main() {
  const [deployer, beneficiary] = await ethers.getSigners();

  const FanTokenContract = await ethers.getContractFactory("FanToken");

  const FanTokenFactoryContract = await ethers.getContractFactory(
    "FanTokenFactory"
  );
  const FanTokenFactory = await FanTokenFactoryContract.deploy();

  await FanTokenFactory.deployed();

  console.log("FanTokenFactory deployed to:", FanTokenFactory.address);

  const tx = await FanTokenFactory.createFanToken("Davlet", "DVT", 1000000);
  const rc = await tx.wait();
  const event = rc.events.find((event) => event.event === "TokenCreated");
  const tokenAddr = event.args.tokenAddress;
  console.log("Token created through FanTokenFactory on:", tokenAddr);

  const token = await FanTokenContract.attach(tokenAddr);
  // const owner = await token.owner();
  // console.log("Owner of the token:", owner);
  const balance = await token.balanceOf(deployer.address);
  console.log("Balance is:", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
