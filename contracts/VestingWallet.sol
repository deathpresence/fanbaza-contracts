// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./libraries/SafeERC20.sol";
import "./libraries/Address.sol";

/**
 * @title VestingWallet
 * @dev This contract handles the vesting of ERC20 tokens for a given beneficiary. Custody of multiple tokens
 * can be given to this contract, which will release the token to the beneficiary following a given vesting schedule.
 * The vesting schedule can be set through the {cliff_} argument in the constructor.
 *
 * Any token transferred to this contract will follow the vesting schedule as if they were locked from the beginning.
 * Consequently, if the vesting has already started, any amount of tokens sent to this contract will (at least partly)
 * be immediately releasable.
 */
contract VestingWallet {
    using SafeERC20 for IERC20;

    event TokenReleased(uint256 amount);

    uint64 public constant MONTH = 30 days; // 1 month duration
    uint64 public constant TOTAL_CLIFF_SIZE = 10000; // 100%

    address private immutable _token; // ERC20 token address
    address private immutable _beneficiary; // Beneficiary address
    uint64 private immutable _start; // Start timestamp in seconds

    uint16[] private _cliff; // Representation of vesting cliff in percent per month
    uint256 private _released; // Released amount of tokens

    constructor(
        address token_,
        address beneficiary_,
        uint64 start_,
        uint16[] memory cliff_
    ) {
        require(token_ != address(0), "VestingWallet: token is zero addres");
        require(
            beneficiary_ != address(0),
            "VestingWallet: beneficiary is zero address"
        );
        require(_checkCliff(cliff_), "VestingWallet: cliff is not 100%");

        _token = token_;
        _beneficiary = beneficiary_;
        _start = start_ == 0 ? uint64(block.timestamp) : start_;
        _cliff = cliff_;
    }

    receive() external payable {}

    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    function start() public view returns (uint256) {
        return _start;
    }

    function released() public view returns (uint256) {
        return _released;
    }

    function reserves() public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    function release() external {
        require(
            start() < block.timestamp,
            "VestingWallet: vesting is not started yet"
        );

        (
            uint16 releasedShare,
            uint16 releasedIntervals
        ) = _calculateReleasedShare();

        require(
            releasedShare > 0 || releasedIntervals > 0,
            "VestingWallet: nothing to withdraw"
        );

        uint256 releasable = _calculateReservesOnShare(
            releasedShare,
            reserves()
        );

        IERC20(_token).safeTransfer(beneficiary(), releasable);
        _released += releasable;

        emit TokenReleased(releasable);
    }

    function _checkCliff(uint16[] memory cliff_) internal pure returns (bool) {
        uint16 total;
        for (uint16 i = 0; i < cliff_.length; i++) {
            total += cliff_[i];
        }

        return total == TOTAL_CLIFF_SIZE;
    }

    function _calculateReleasedShare() internal view returns (uint16, uint16) {
        uint16 releasedShare = 0;
        uint256 accumulatedDate = start();
        uint16 i = 0;

        for (i; i < _cliff.length; i++) {
            accumulatedDate += MONTH;
            if (accumulatedDate > block.timestamp) {
                break;
            }
            releasedShare += _cliff[i];
        }

        return (releasedShare, i);
    }

    function _calculateReservesOnShare(uint32 _share, uint256 _amount)
        internal
        pure
        returns (uint256)
    {
        require(_share <= 10000, "VestingWallet: total share is greater than 100%");

        return (_amount / 10000) * _share;
    }
}
