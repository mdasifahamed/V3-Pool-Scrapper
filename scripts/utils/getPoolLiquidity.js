const { ethers, artifacts } = require("hardhat");
const getProvider = require("./provider");
const artifactMap = require("../../abi-map.json");

async function getPoolLiquidity(poolAddress, provider_url, defiName) {
  const provider = await getProvider(provider_url);

  // getpoolArtifact(defiName)
  const poolArtifatcs = await getPoolArtifact(defiName);

  console.log(poolArtifatcs)
  if (!poolArtifatcs) {
    throw new Error(`No pool artifact mapping found for ${defiName}`);
  }

  const poolContract = new ethers.Contract(
    poolAddress,
    poolArtifatcs.abi,
    provider
  );

  try {
    // dynamic pool liquidity
    const reserve0 = await poolContract.reserve0();
    const reserve1 = await poolContract.reserve1();

    return {
      reserve0: ethers.formatEther(reserve0),
      reserve1: ethers.formatEther(reserve1),
    };
  } catch (error) {
    console.log(error);
    console.log("Error At getPoolLiquidty.js");
  }
}

async function getPoolArtifact(defiName) {
  const artifactPath = artifactMap[defiName.toLowerCase()];

  if (!artifactPath) {
    throw new Error(`No factory artifact mapping found for ${defiName}`);
  }

  return artifacts.readArtifactSync(artifactPath.poolArtifact);
}

module.exports = getPoolLiquidity;
