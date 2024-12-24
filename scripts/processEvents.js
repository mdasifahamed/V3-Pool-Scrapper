const { ethers, artifacts } = require("hardhat");
const getProvider = require("./utils/provider");
const getTokenInfo = require("./utils/getTokenInfo");
const getPoolLiquidity = require("./utils/getPoolLiquidity");
const fs = require("fs");
const FactoryArtifacts = artifacts.readArtifactSync(
  "contracts/interfaces/IUniswapV3Factory.sol:IUniswapV3Factory"
);

async function processEvents(
  provider_url,
  factoryAddress,
  range,
  startingBlock,
  filename
) {
  const provider = await getProvider(provider_url);
  const factoryContract = new ethers.Contract(
    factoryAddress,
    FactoryArtifacts.abi,
    provider
  );

  const filter = factoryContract.filters.PoolCreated();
  let poolInfoStore = [];
  let endingBlock = startingBlock + 50000; // fixed block filtering range is 50000
  for (let index = 0; index < range; index++) {
    const events = await factoryContract.queryFilter(
      filter,
      startingBlock,
      endingBlock
    );
    console.log(
      `Number Of Events In The Block ${startingBlock} To ${endingBlock} is ${events.length}`
    );
    let eventsNumber = 0;
    try {
      for (const event of events) {
        try {
          const token0Info = await getTokenInfo(event.args[0], provider_url);
          const token1Info = await getTokenInfo(event.args[1], provider_url);
          const poolLiquidity = await getPoolLiquidity(
            event.args[4],
            provider_url
          );

          const poolInfo = {
            poolAddress: event.args[4],
            token0Add: event.args[0],
            token0Name: token0Info.tokenName,
            token0Symbol: token0Info.tokenSymbol,
            token0Decimal: token0Info.tokenDecimals,
            token1Add: event.args[1],
            token1Name: token1Info.tokenName,
            token1Symbol: token1Info.tokenSymbol,
            token1Decimal: token1Info.tokenDecimals,
            poolfee: parseInt(event.args[2]),
            poolLiquidity: poolLiquidity.liquidity,
            tickSpacing: parseInt(event.args[3]),
          };

          poolInfoStore.push(poolInfo);

          fs.writeFile(
            `${filename}.json`,
            JSON.stringify(poolInfoStore),
            (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log(
                  `Processing Events No ${eventsNumber} From ${startingBlock} To ${endingBlock}`
                );
              }
            }
          );
        } catch (error) {
          console.log(`Skipped event:`, event);
        }
        eventsNumber = eventsNumber + 1;
      }
      startingBlock = endingBlock + 1;
      endingBlock = startingBlock + 50000;

      console.log("New Starting Block Number", startingBlock);
      console.log("New Ending Block", endingBlock);
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
    }
  }
}
module.exports = processEvents;
