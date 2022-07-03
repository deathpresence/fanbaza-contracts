import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS, TOKENS, VESTING_WALLETS } from "../scripts/constants";
import { FanToken__factory, VestingWallet__factory } from "../typechain/index";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy } = deployments;
    const { deployer, beneficiary } = await getNamedAccounts();
    const signer = ethers.provider.getSigner(deployer);

    const fanToken = FanToken__factory.connect(
        "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
        signer
    );

    const vestingWallet = VestingWallet__factory.connect("0xCafac3dD18aC6c6e92c921884f9E4176737C052c", signer)
    console.log("==================================CHECK==================================")
    const cliff = await vestingWallet.cliff()
    console.log(`Cliff: ${cliff}`)

    // await ethers.provider.send("evm_increaseTime", [2628288 * 3]);
    // await ethers.provider.send("evm_mine", []);
    // console.log("After 3 months")
    // await vestingWallet.release()

    const balance = await fanToken.balanceOf(beneficiary)
    console.log(`Balance of beneficiary after 3 months: ${ethers.utils.formatEther(balance)}`)

};

func.tags = ["migration", "factory"];

export default func;
