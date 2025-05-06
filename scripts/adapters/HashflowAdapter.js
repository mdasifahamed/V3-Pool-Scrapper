import { ethers } from "hardhat";
import BaseAdapter from "./BaseAdapter";

// hashflow happing no token0 and token1 function to fetch token info

class HashflowAdapter extends BaseAdapter {
    getEventFilter(contract) {
        return contract.filters.CreatePool();
    }

    parseEvent(event) {
        return {
            poolAddress: event.args[0],
            token0: event.args[0],
            token1: event.args[1]
        };
    }

    async getReserves(poolAddress) {
        const poolContract = new ethers.Contract(
            poolAddress,
            this.artifacts.poolArtifact.abi,
            this.provider
        );

        const liquidity = await poolContract.liquidity();

        return {
            liquidity: ethers.formatEther(liquidity)
        };
    }

}



module.exports = HashflowAdapter;