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

  const VestingWalletContract = await ethers.getContractFactory(
    "VestingWallet"
  );

  const VestingWalletFactoryContract = await ethers.getContractFactory(
    "VestingWalletFactory"
  );
  const VestingWalletFactory = await VestingWalletFactoryContract.deploy();
  await VestingWalletFactory.deployed();

  console.log("test");

  const tx = await FanTokenFactory.createFanToken(
    "Davlet Yagshy Token",
    "DVT",
    100000000,
    deployer.address
  );
  const rc = await tx.wait();
  const event = rc.events.find((event) => event.event === "TokenCreated");
  const tokenAddr = event.args.tokenAddress;
  console.log("Token created through FanTokenFactory on:", tokenAddr);

  const token = await FanTokenContract.attach(tokenAddr);
  // const owner = await token.owner();
  // console.log("Owner of the token:", owner);
  const balance = await token.balanceOf(deployer.address);
  console.log("Balance is:", balance.toString());

  const tx2 = await VestingWalletFactory.createVestingWallet(
    tokenAddr,
    beneficiary.address,
    Math.ceil(Date.now() / 1000),
    [
      475, 475, 475, 475, 475, 475, 475, 475, 475, 475, 475, 475, 475, 475, 475,
      475, 475, 475, 475, 475, 500,
    ]
  );
  const rc2 = await tx2.wait();
  const event2 = rc2.events.find(
    (event) => event.event === "VestingWalletCreated"
  );
  const walletAddr = event2.args.vestingWalletAddress;
  console.log(
    "Vesting Wallet created through VestingWalletFactory on:",
    walletAddr
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
