const { ethers } = require("hardhat");
const BaseAdapter = require("./BaseAdapter");

class MaverickAdapter extends BaseAdapter {
    getEventFilter(contract) {
        return contract.filters.PoolCreated();
    }

    parseEvent(event) {
        return {
            poolAddress: event.args[0],
            token0: event.args[7],
            token1: event.args[8]
        };
    }

    // not used in maverick
    async getReserves(poolAddress) {
        /*
        const poolContract = new ethers.Contract(
            poolAddress,
            this.artifacts.poolArtifact.abi,
            this.provider
        );

        const reserve0 = await poolContract.getReserves0();
        const reserve1 = await poolContract.getReserves1();
        */

        return {
            reserve0: ethers.formatEther(0), // dummy value
            reserve1: ethers.formatEther(0), // dummy value
        };
    }
}

module.exports = MaverickAdapter;