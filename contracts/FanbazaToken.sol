// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./entities/ERC20.sol";
import "./entities/ERC20Permit.sol";

contract FanbazaToken is ERC20, ERC20Permit {
    constructor() ERC20("Fanbaza Token", "FBT") ERC20Permit("Fanbaza Token") {
        _mint(msg.sender, 2000000000 * 10**decimals());
    }
}
