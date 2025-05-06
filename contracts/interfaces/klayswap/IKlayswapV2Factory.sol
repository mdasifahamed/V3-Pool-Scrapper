// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IKlayswapV2Factory {
    event CreatePool(
        address token0,
        uint256 amount0,
        address token1,
        uint256 amount1,
        uint256 fee,
        address exchange,
        uint256 exid
    );

    function getPoolCount() external view returns (uint);

    function getPoolAddress(uint idx) external view returns (address);
}
