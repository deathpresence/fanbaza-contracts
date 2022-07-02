// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "./entities/ERC20.sol";
import "./entities/ERC20Permit.sol";

contract FanbazaToken is ERC20, ERC20Permit {
    constructor() ERC20("Fanbaza Token", "BAZA") ERC20Permit("Fanbaza Token") {
        _mint(msg.sender, 2000000000 * 10**decimals());
    }
}
