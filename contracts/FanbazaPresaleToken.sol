// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./entities/ERC20.sol";
import "./entities/ERC20Permit.sol";

contract FanbazaPresaleToken is ERC20, ERC20Permit {
    constructor()
        ERC20("Fanbaza Presale Token", "BAZA-1")
        ERC20Permit("Fanbaza Presale Token")
    {
        _mint(
            0x02c97D96E645EB19eCA657f6251a6eb08a6cc80d,
            2000000000 * 10**decimals()
        );
    }
}
