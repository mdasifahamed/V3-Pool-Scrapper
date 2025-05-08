const { artifacts } = require("hardhat");
const SyncSwapAdapter = require("./SyncSwapAdapter");
const MaverickAdapter = require("./MaverickAdapter");
const KlaySwapAdapter = require("./KlayswapAdapter");
const TraderJoeAdapter = require("./TraderJoeAdapter");
const UnifiAdapter = require("./UnifiAdapter");
const artifactMap = require("../../abi-map.json");
const DfxAdapter = require("./DfxAdapter");

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
        return new SyncSwapAdapter(provider, artifactsBundle);
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

    if( key === "unifi") {
        return new UnifiAdapter(provider, artifactsBundle);
    }

    if( key === "dfx") {
        return new DfxAdapter(provider, artifactsBundle);
    }

    throw new Error(`No adapter defined for ${defiName}`);
}

module.exports = getAdapter;
