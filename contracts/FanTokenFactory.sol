// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./FanToken.sol";
import "./entities/Ownable.sol";

contract USTFactory is Ownable {
    address[] private _tokens;

    event TokenCreated(address indexed token, uint256 amount);

    function tokens() public view returns (address[] memory) {
        return _tokens;
    }

    function token(uint256 index) public view returns (address) {
        return _tokens[index];
    }

    function createFanToken(
        string calldata _name,
        string calldata _symbol,
        uint256 _amount
    ) external onlyOwner returns (address) {
        FanToken newToken = new FanToken(_name, _symbol, _amount);

        address tokenAddress = address(newToken);

        _tokens.push(tokenAddress);

        emit TokenCreated(tokenAddress, newToken.totalSupply());

        return tokenAddress;
    }
}
