import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS, TOKENS, VESTING_WALLETS } from "../scripts/constants";
import { FanTokenFactory__factory, VestingWalletFactory__factory } from "../typechain/index";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer, beneficiary } = await getNamedAccounts();
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

 
};

func.tags = ["migration", "factory"];

export default func;
