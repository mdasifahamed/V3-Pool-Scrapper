// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface ISyncSwapPoolManager {
    event SetFactoryWhitelisted(address indexed factory, bool whitelisted);

    event RegisterPool(
        address indexed factory,
        address indexed pool,
        uint16 indexed poolType,
        bytes data
    );

    event UpdateForwarderRegistry(address indexed newForwarderRegistry);

    event UpdateFeeManager(address indexed newFeeManager);

    function vault() external view returns (address);

    function feeManager() external view returns (address);

    function pools(uint) external view returns (address);

    function poolsLength() external view returns (uint);

    // Forwarder Registry
    function setForwarderRegistry(address) external;

    // Fees
    function setFeeManager(address) external;

    // Factories
    function isFactoryWhitelisted(address) external view returns (bool);

    function setFactoryWhitelisted(address factory, bool whitelisted) external;

    // Pools
    function isPool(address) external view returns (bool);

    function getPool(bytes32) external view returns (address);

    function createPool(
        address factory,
        bytes calldata data
    ) external returns (address pool);

    function registerPool(
        address pool,
        uint16 poolType,
        bytes calldata data
    ) external;
}
