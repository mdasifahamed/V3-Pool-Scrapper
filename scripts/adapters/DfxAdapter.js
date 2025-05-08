const { ethers } = require('hardhat');
const BaseAdapter = require('./BaseAdapter');

class DfxAdapter extends BaseAdapter {
    getEventFilter(contract) {
        return contract.filters.NewCurve();
    }

    async parseEvent(event) {
        const tokens = await this.getTokens(event.args[2]);
        return {
            poolAddress: event.args[2],
            token0: tokens.token0,
            token1: tokens.token1
        };
    }

    async getReserves(poolAddress) {
        const poolContract = new ethers.Contract(
            poolAddress,
            this.artifacts.poolArtifact.abi,
            this.provider
        );

        return {
            reverse0: '0',
            reverse1: '0',
        };
    }

    async getTokens(poolAddress) {
        const poolContract = new ethers.Contract(
            poolAddress,
            this.artifacts.poolArtifact.abi,
            this.provider
        );

        const [token0, token1] = await Promise.all([
            poolContract.reserves(0),
            poolContract.reserves(1)
        ]);

        return {
            token0,
            token1
        }
    }
}

module.exports = DfxAdapter;
