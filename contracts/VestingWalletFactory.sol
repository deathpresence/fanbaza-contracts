// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./VestingWallet.sol";
import "./entities/Ownable.sol";

/**
 * @title VestingWalletFactory
 * @author Alexey Eramasov
 * @dev This contract handles the creation and registration of new VestingWallet contracts.
 */
contract VestingWalletFactory is Ownable {
    address[] private _registry;

    event VestingWalletCreated(address indexed vestingWalletAddress);

    function registry() public view returns (address[] memory) {
        return _registry;
    }

    function vestingWallet(uint256 index) public view returns (address) {
        return _registry[index];
    }

    function createVestingWallet(
        address token,
        address beneficiary,
        uint64 start,
        uint16[] calldata cliff
    ) external onlyOwner returns (address) {
        VestingWallet newVestingWallet = new VestingWallet(
            token,
            beneficiary,
            start,
            cliff
        );

        address vestingWalletAddress = address(newVestingWallet);

        _registry.push(vestingWalletAddress);

        emit VestingWalletCreated(vestingWalletAddress);

        return address(vestingWalletAddress);
    }
}
