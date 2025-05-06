const { artifacts } = require("hardhat");
const SyncSwapAdapter = require("./SyncSwapAdapter");
const MaverickAdapter = require("./MaverickAdapter");
const KlaySwapAdapter = require("./KlayswapAdapter");
const TraderJoeAdapter = require("./TraderJoeAdapter");
const artifactMap = require("../../abi-map.json");

function getAdapter(defiName, provider) {
    const key = defiName.toLowerCase();
    const entry = artifactMap[key];

    if (!entry) {
        throw new Error(`No artifact mapping found for ${defiName}`);
    }

    const artifactsBundle = {
        factoryArtifact: artifacts.readArtifactSync(entry.pathToAbi),
        poolArtifact: artifacts.readArtifactSync(entry.poolArtifact),
    };

    if (key === "syncswap") {
        return new SyncSwapAdapter(provider, artifactsBundle); // replace with new SyncSwapAdapter
    }

    if (key === "maverick") {
        return new MaverickAdapter(provider, artifactsBundle); 
    }

    if (key === "klayswap") {
        return new KlaySwapAdapter(provider, artifactsBundle);
    }

    if (key === "traderjoe") {
        return new TraderJoeAdapter(provider, artifactsBundle);
    }

    throw new Error(`No adapter defined for ${defiName}`);
}

module.exports = getAdapter;
