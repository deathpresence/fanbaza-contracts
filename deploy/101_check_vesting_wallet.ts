import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CONTRACTS, TOKENS, VESTING_WALLETS } from "../scripts/constants";
import { FanToken__factory, VestingWallet__factory } from "../typechain/index";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const signer = ethers.provider.getSigner(deployer);

    const fanToken = FanToken__factory.connect(
        "0xB6F94EbAB46Af097aCd219d29F4eDCe028eD7CAE",
        signer
    );

    const vestingWallet = VestingWallet__factory.connect("0x81222547E683e645214e6C9f5E7C92c64eC32c4F", signer)
    console.log("==================================CHECK==================================")
    const cliff = await vestingWallet.cliff()
    console.log(`Cliff: ${cliff}`)

    const reserves = await vestingWallet.reserves()
    console.log("Reserves:", ethers.utils.formatEther(reserves))

    // await ethers.provider.send("evm_increaseTime", [2628288 * 100]);
    // await ethers.provider.send("evm_mine", []);
    // console.log("After 3 months")
    // await vestingWallet.release()

    // const balance = await fanToken.balanceOf(VESTING_WALLETS.DAVLET.beneficiary)
    // console.log(`Balance of beneficiary after 3 months: ${ethers.utils.formatEther(balance)}`)

    const deployerBalance = await fanToken.balanceOf(deployer)
    console.log(`Balance of deployer: ${ethers.utils.formatEther(deployerBalance)}`)


};

func.tags = ["migration", "factory"];

export default func;
