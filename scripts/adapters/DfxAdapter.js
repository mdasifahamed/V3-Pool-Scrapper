const {ethers} = require('hardhat');
const BaseAdapter = require('./BaseAdapter');

class DfxAdapter extends BaseAdapter {
    getEventFilter(contract) {
        console.log(contract.filters.NewCurve())
        return contract.filters.NewCurve();
    }

    parseEvent(event) {
        console.log(event)
        return {
            poolAddress: event.args[2]
        };
    }

    async getReserves(poolAddress) {
        // const poolContract = new ethers.Contract(
        //     poolAddress,
        //     this.artifacts.poolArtifact.abi,
        //     this.provider
        // );

        // const reserve = await poolContract.getReserves();
        // const reserve0 = reserve[0];
        // const reserve1 = reserve[1];

        return {
            reserve0: 0,
            reserve1: 0
        };
    }
}

module.exports = DfxAdapter;
