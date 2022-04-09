// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./entities/ERC20.sol";
import "./entities/ERC20Permit.sol";

contract MockToken is ERC20, ERC20Permit {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _amount
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        _mint(msg.sender, _amount * 10**decimals());
    }
}
