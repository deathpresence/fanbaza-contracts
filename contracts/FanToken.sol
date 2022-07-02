// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "./entities/ERC20.sol";
import "./entities/ERC20Permit.sol";

contract FanToken is ERC20, ERC20Permit {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _amount,
        address _to
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        _mint(_to, _amount * 10**decimals());
    }
}
