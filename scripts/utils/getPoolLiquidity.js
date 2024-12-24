const { ethers, artifacts } = require("hardhat");
const getProvider = require("./provider");
const poolArtifatcs = artifacts.readArtifactSync(
  "contracts/interfaces/IUniswapV3Pool.sol:IUniswapV3Pool"
);
async function getPoolLiquidity(poolAddress, provider_url) {
  const provider = await getProvider(provider_url);
  const poolContract = new ethers.Contract(
    poolAddress,
    poolArtifatcs.abi,
    provider
  );
  try {
    const liquidityGross = await poolContract.liquidity();
    return {
      liquidity: ethers.formatEther(liquidityGross),
    };
  } catch (error) {
    console.log(error);
    console.log("Error At getPoolLiquidty.js");
  }
}

module.exports = getPoolLiquidity;
