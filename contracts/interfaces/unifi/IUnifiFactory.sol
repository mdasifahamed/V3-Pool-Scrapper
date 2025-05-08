// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUnifiFactory {
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint
    );

    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);

    function allPairs(uint) external view returns (address pair);

    function allPairsLength() external view returns (uint);

    function createPair(
        address tokenA,
        address tokenB
    ) external returns (address pair);

    function feeTo() external returns (address);

    function setFeeTo(address) external;

    function setFeeToSetter(address) external;

    function feeController() external view returns (address);

    function router() external view returns (address);
}
