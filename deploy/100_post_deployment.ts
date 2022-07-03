import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS, TOKENS } from "../scripts/constants";
import { FanTokenFactory__factory } from "../typechain";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const signer = ethers.provider.getSigner(deployer);

  const FanTokenFactoryDeployment = await deployments.get(
    CONTRACTS.FanTokenFactory
  );
  const fanTokenFactory = await FanTokenFactory__factory.connect(
    FanTokenFactoryDeployment.address,
    signer
  );

  for (const [_, token] of Object.entries(TOKENS)) {
    const tx = await fanTokenFactory.createFanToken(
      token.name,
      token.symbol,
      token.supply,
      token.to
    );
    const receipt = await tx.wait();
    const event = receipt.events?.find(
      (event) => event.event === "TokenCreated"
    );
    const tokenAddress  = event?.args?.tokenAddress;
    console.log(
      `Token ${token.symbol} created through FanTokenFactory on: ${tokenAddress}`
    );
  }
};

func.tags = [CONTRACTS.VestingWalletFactory, "migration", "factory"];

export default func;
