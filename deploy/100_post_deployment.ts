import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS, TOKENS, VESTING_WALLETS } from "../scripts/constants";
import { FanTokenFactory__factory, VestingWalletFactory__factory } from "../typechain/index";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const signer = ethers.provider.getSigner(deployer);

  const FanTokenFactoryDeployment = await deployments.get(
    CONTRACTS.FanTokenFactory
  );
  const fanTokenFactory = FanTokenFactory__factory.connect(
    FanTokenFactoryDeployment.address,
    signer
  );

  const VestingWalletFactoryDeployment = await deployments.get(CONTRACTS.VestingWalletFactory)
  const vestingWalletFactory = VestingWalletFactory__factory.connect(VestingWalletFactoryDeployment.address, signer)

  for (const [key, token] of Object.entries(TOKENS)) {
    let tx = await fanTokenFactory.createFanToken(
      token.name,
      token.symbol,
      token.supply,
      token.to
    );
    let receipt = await tx.wait();
    let event = receipt.events?.find(
      (event) => event.event === "TokenCreated"
    );
    const tokenAddress = event?.args?.tokenAddress;
    console.log(
      `Token ${token.symbol} created through FanTokenFactory on: ${tokenAddress}`
    );

    tx = await vestingWalletFactory.createVestingWallet(tokenAddress, VESTING_WALLETS[key].beneficiary, VESTING_WALLETS[key].start, VESTING_WALLETS[key].schedule)
    receipt = await tx.wait();
    event = receipt.events?.find(
      (event) => event.event === "VestingWalletCreated"
    );
    const vestingWalletAddress = event?.args?.vestingWalletAddress;
    console.log(
      `Vesting walet in ${token.symbol} token for ${VESTING_WALLETS[key].beneficiary} created through VestingWalletFactory on: ${vestingWalletAddress}`
    );

  }
};

func.tags = ["migration", "factory"];

export default func;
