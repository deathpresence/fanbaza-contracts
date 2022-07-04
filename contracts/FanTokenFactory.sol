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
        string calldata name,
        string calldata symbol,
        uint256 amount,
        address to
    ) external onlyOwner returns (address) {
        if (to == address(0)) {
            to = owner();
        }
        FanToken newToken = new FanToken(name, symbol, amount, to);

        address tokenAddress = address(newToken);
        _tokens.push(tokenAddress);

        emit TokenCreated(tokenAddress, newToken.totalSupply());

        return tokenAddress;
    }

    function addFanToken(address _token) external onlyOwner {
        require(
            _token != address(0),
            "FanTokenFactory: token address cannot be zero"
        );

        _tokens.push(_token);
    }

    function removeFanToken(uint256 index) external onlyOwner {
        require(
            index <= _tokens.length,
            "FanTokenFactory: index is out of range"
        );

        for (uint256 i = index; i < _tokens.length - 1; i++) {
            _tokens[i] = _tokens[i + 1];
        }

        _tokens.pop();
    }
}
