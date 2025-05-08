const { ethers } = require("hardhat");
const BaseAdapter = require("./BaseAdapter");

class UnifiAdapter extends BaseAdapter {
    getEventFilter(contract) {
        return contract.filters.PairCreated();
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

        const reserve = await poolContract.getReserves();
        const reserve0 = reserve[0];
        const reserve1 = reserve[1];

        return {
            reserve0: ethers.formatEther(reserve0),
            reserve1: ethers.formatEther(reserve1)
        };
    }
}

module.exports = UnifiAdapter;