// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IKlayswapV3Factory {
    event PoolCreated(
        address indexed token0,
        address indexed token1,
        uint24 indexed fee,
        int24 tickSpacing,
        address pool,
        uint256 exid
    );

    function getPoolCount() external view returns (uint256);

    function getPoolAddress(uint256 idx) external view returns (address);

    function getPool(
        address tokenA,
        address tokenB,
        uint24 fee
    ) external view returns (address pool);
}
