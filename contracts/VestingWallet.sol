// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./libraries/SafeERC20.sol";
import "./libraries/Address.sol";

/**
 * @title VestingWallet
 * @author Alexey Eramasov
 * @dev This contract handles the vesting of ERC20 token for a given beneficiary. Custody of token
 * can be given to this contract, which will release the token to the beneficiary following a given vesting schedule.
 * The vesting schedule can be set through the {cliff_} argument in the constructor.
 *
 * Token specified to this contract will follow the vesting schedule as if it was locked from the beginning.
 */
contract VestingWallet {
    using SafeERC20 for IERC20;

    event TokenReleased(uint256 amount);

    uint256 public constant MONTH = 30 days; // 1 month duration
    uint256 public constant TOTAL_CLIFF_SIZE = 10000; // 100%

    address private immutable _token; // ERC20 token address
    address private immutable _beneficiary; // Beneficiary address
    uint256 private immutable _start; // Start timestamp in seconds

    uint16[] private _cliff; // Representation of vesting cliff in percent per month
    uint256 private _released; // Released amount of the token

    /**
     * @dev Sets the values of the {token}, {beneficiary}, {start} and {cliff}
     */
    constructor(
        address token_,
        address beneficiary_,
        uint256 start_,
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
        _start = start_ == 0 ? block.timestamp : start_;
        _cliff = cliff_;
    }

    /**
     * @dev Returns beneficiary address
     */
    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    /**
     * @dev Returns start timestamp
     */
    function start() public view returns (uint256) {
        return _start;
    }

    /**
     * @dev Returns vesting cliff array
     */
    function cliff() public view returns (uint16[] memory) {
        return _cliff;
    }

    /**
     * @dev Returns released amount of the token
     */
    function released() public view returns (uint256) {
        return _released;
    }

    /**
     * @dev Returns reserves of token the locked in the contract
     */
    function reserves() public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    /**
     * @dev Releases locked token according to vesting schedule
     */
    function release() external {
        require(
            _start < block.timestamp,
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

        IERC20(_token).safeTransfer(_beneficiary, releasable);
        _released += releasable;

        emit TokenReleased(releasable);
    }

    /**
     * @dev Checks vesting cliff for required length
     * @param cliff_ Representation of vesting cliff
     * @return bool Result of equality check
     */
    function _checkCliff(uint16[] memory cliff_) internal pure returns (bool) {
        uint16 total;
        for (uint16 i = 0; i < cliff_.length; i++) {
            total += cliff_[i];
        }

        return total == TOTAL_CLIFF_SIZE;
    }

    /**
     * @dev Calculates released share and current interval
     * @return releasedShare Total share that already released by now from start
     * @return i Current interval in cliff
     */
    function _calculateReleasedShare() internal view returns (uint16, uint16) {
        uint16 releasedShare = 0;
        uint16 i = 0;
        uint256 accumulatedDate = start();

        for (i; i < _cliff.length; i++) {
            accumulatedDate += MONTH;
            if (accumulatedDate > block.timestamp) {
                break;
            }
            releasedShare += _cliff[i];
        }

        return (releasedShare, i);
    }

    /**
     * @dev Calculates how many reserves must be released for a given share
     * @param _share Some share of total reserves
     * @param _amount  Total amount of the token reserves
     * @return uint256 Calculation result
     */
    function _calculateReservesOnShare(uint32 _share, uint256 _amount)
        internal
        pure
        returns (uint256)
    {
        require(
            _share <= TOTAL_CLIFF_SIZE,
            "VestingWallet: total share is greater than 100%"
        );

        return (_amount / TOTAL_CLIFF_SIZE) * _share;
    }
}
