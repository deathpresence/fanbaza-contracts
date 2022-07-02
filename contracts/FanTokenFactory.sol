// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "./FanToken.sol";
import "./entities/Ownable.sol";

contract FanTokenFactory is Ownable {
    address[] private _tokens;

    event TokenCreated(address indexed tokenAddress, uint256 amount);

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
        FanToken newToken = new FanToken(_name, _symbol, _amount, owner());

        address tokenAddress = address(newToken);

        _tokens.push(tokenAddress);

        emit TokenCreated(tokenAddress, newToken.totalSupply());

        return tokenAddress;
    }
}
