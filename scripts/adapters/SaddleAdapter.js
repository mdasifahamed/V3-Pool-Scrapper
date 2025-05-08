const { ethers } = require("hardhat");
const abiMap = require("../../artifacts/contracts/interfaces/saddle/IPoolRegistry.sol/IPoolRegistry.json");
const getTokenInfo = require("../utils/getTokenInfo");
const fs = require('fs');

class SaddleAdapter {
    rpc = "https://arb1.arbitrum.io/rpc";

    constructor() {
        this.contract = null;
    }

    async init(contractAddress) {
        const provider = new ethers.JsonRpcProvider(this.rpc);
        this.contract = new ethers.Contract(contractAddress, abiMap.abi, provider);
    }

    async getPoolsLength() {
        if (!this.contract) {
            throw new Error("Contract not initialized. Call init() first.");
        }
        const poolCount = await this.contract.getPoolsLength();
        console.log("Pools Length:", poolCount.toString());

        for (let i = 0; i < poolCount; i++) {
            const pooldata = await this.getPoolDataAtIndex(BigInt(i));
            console.log(pooldata);

            const existingData = fs.existsSync('saddle_pooldata.json') 
                ? JSON.parse(fs.readFileSync('saddle_pooldata.json')) 
                : [];
            existingData.push(pooldata);
            fs.writeFileSync('saddle_pooldata.json', JSON.stringify(existingData, null, 2));
        }
    }

    async getPoolDataAtIndex(index) {
        if (!this.contract) {
            throw new Error("Contract not initialized. Call init() first.");
        }
        const poolData = await this.contract.getPoolDataAtIndex(BigInt(index));

        //get pool tokens
        const tokens = await this.getTokens(poolData.poolAddress);

        const token0Info = await getTokenInfo(tokens[0], this.rpc);
        const token1Info = await getTokenInfo(tokens[1], this.rpc);

        return {
            poolAddress: poolData.poolAddress,
            token0: tokens[0],
            token0Name: token0Info.tokenName,
            token0Symbol: token0Info.tokenSymbol,
            token0Decimals: token0Info.tokenDecimals,
            token1: tokens[1],
            token1Name: token1Info.tokenName,
            token1Symbol: token1Info.tokenSymbol,
            token1Decimals: token1Info.tokenDecimals,
        };
    }

    async getTokens(poolAddress) {
        if (!this.contract) {
            throw new Error("Contract not initialized. Call init() first.");
        }
        const tokens = await this.contract.getTokens(poolAddress);
        return tokens;
    }
}

const saddleAdapter = new SaddleAdapter();
saddleAdapter.init("0x38262c17a06A6B3588d3E5b70dfa768C06bf4ef1")
    .then(() => saddleAdapter.getPoolsLength())
    .catch((error) => console.error("Error:", error));

