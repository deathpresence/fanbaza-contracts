// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./VestingWallet.sol";
import "./entities/Ownable.sol";

contract VestingWalletFactory is Ownable {
    address[] private _registry;

    event VestingWalletCreated(address indexed vestingWalletAddress);

    function registry() public view returns(address[] memory) {
        return _registry;
    }

    function createVestingWallet(
        address token,
        address beneficiary,
        uint64 start,
        uint16[] calldata cliff
    ) external onlyOwner returns (address) {
        VestingWallet vestingWallet = new VestingWallet(
            token,
            beneficiary,
            start,
            cliff
        );

        address vestingWalletAddress = address(vestingWallet);

        _registry.push(vestingWalletAddress);

        emit VestingWalletCreated(vestingWalletAddress);

        return address(vestingWalletAddress);
    }
}
