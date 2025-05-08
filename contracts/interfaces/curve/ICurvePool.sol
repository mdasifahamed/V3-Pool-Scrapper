// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface ICurvePool {
    function reserves(uint256 index) external view returns (address);
}
