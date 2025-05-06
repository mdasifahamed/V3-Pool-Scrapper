const { ethers } = require("hardhat");
const BaseAdapter = require("./BaseAdapter");

class KlaySwapAdapter extends BaseAdapter {
    getEventFilter(contract) {
        return contract.filters.PoolCreated();
    }

    parseEvent(event) {
        return {
            poolAddress: event.args[4],
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

module.exports = KlaySwapAdapter;