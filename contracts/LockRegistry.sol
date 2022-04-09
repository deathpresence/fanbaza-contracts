// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Lock.sol";
import "./entities/Ownable.sol";

contract LockRegistry is Ownable {
    Lock[] public registry;

    function createLock(uint256 _endDate) external onlyOwner returns (address) {
        Lock newLock = new Lock(_endDate);

        registry.push(newLock);

        return address(newLock);
    }
}
