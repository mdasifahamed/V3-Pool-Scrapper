const { ethers } = require("hardhat");
const BaseAdapter = require("./BaseAdapter");

class SyncSwapAdapter extends BaseAdapter {
    getEventFilter(contract) {
        return contract.filters.PoolCreated();
    }

    parseEvent(event) {
        return {
            poolAddress: event.args[2],
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

        const reserve0 = await poolContract.reserve0();
        const reserve1 = await poolContract.reserve1();

        return {
            reserve0: ethers.formatEther(reserve0),
            reserve1: ethers.formatEther(reserve1),
        };
    }
}

module.exports = SyncSwapAdapter;