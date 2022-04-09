// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./libraries/SafeERC20.sol";

contract Lock {
    using SafeERC20 for IERC20;

    uint256 private _endDate;

    constructor(uint256 endDate_) {
        _endDate = endDate_;
    }

    function withdraw(address _token, address _to, uint256 _amount) external {
      require(_endDate <= block.timestamp, "Lock: Too early to withdraw");

      IERC20(_token).safeTransfer(_to, _amount);
    }
}
