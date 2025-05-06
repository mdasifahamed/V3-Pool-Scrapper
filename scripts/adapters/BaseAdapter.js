class BaseAdapter {
    constructor(provider, artifacts) {
        this.provider = provider;
        this.artifacts = artifacts;
    }

    getEventFilter(contract) {
        throw new Error("getEventFilter() must be implemented");
    }

    parseEvent(event) {
        throw new Error("parseEvent() must be implemented");
    }

    async getReserves(poolAddress) {
        throw new Error("getReserves() must be implemented");
    }
}

module.exports = BaseAdapter;
