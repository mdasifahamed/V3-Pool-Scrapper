const { ethers } = require("hardhat");
const BaseAdapter = require("./BaseAdapter");

class TraderJoeAdapter extends BaseAdapter {
    getEventFilter(contract) {
        return contract.filters.LBPairCreated();
    }

    parseEvent(event) {
        return {
            poolAddress: event.args[3],
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

        const liquidity = await poolContract.getReserves();
        const reserve0 = liquidity[0];
        const reserve1 = liquidity[1];

        return {
            reserve0: ethers.formatEther(reserve0),
            reserve1: ethers.formatEther(reserve1),
        };
    }
}

module.exports = TraderJoeAdapter;