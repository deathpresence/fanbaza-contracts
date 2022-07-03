import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS } from "../scripts/constants";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy(CONTRACTS.FanTokenFactory, {
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

func.tags = [CONTRACTS.FanTokenFactory, "migration", "factory"];

export default func;
