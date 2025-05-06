const { ethers } = require("hardhat");
const getProvider = require("./utils/provider");
const getTokenInfo = require("./utils/getTokenInfo");
const getAdapter = require("./adapters/adapterFactory");
const fs = require("fs");

async function processEvents(
  provider_url,
  factoryAddress,
  range,
  startingBlock,
  filename,
  defiName
) {
  const provider = await getProvider(provider_url);
  const adapter = getAdapter(defiName, provider);

  const factoryContract = new ethers.Contract(
    factoryAddress,
    adapter.artifacts.factoryArtifact.abi,
    provider
  );
  const filter = adapter.getEventFilter(factoryContract);
  const currentBlock = await provider.getBlockNumber();
  const poolInfoStore = [];

  const MAX_BLOCK_SPAN = 1000;

  for (let i = 0; i < range; i++) {
    if (startingBlock > currentBlock) {
      console.log("Reached current latest block. Stopping.");
      break;
    }

    const endBlock = Math.min(startingBlock + MAX_BLOCK_SPAN - 1, currentBlock);

    try {
      const events = await factoryContract.queryFilter(
        filter,
        startingBlock,
        endBlock
      );
      console.log(
        `Events in block ${startingBlock}-${endBlock}: ${events.length}`
      );

      for (const event of events) {
        try {
          const parsed = adapter.parseEvent(event);
          const [token0Info, token1Info] = await Promise.all([
            getTokenInfo(parsed.token0, provider_url),
            getTokenInfo(parsed.token1, provider_url),
          ]);

          const reserves = await adapter.getReserves(parsed.poolAddress);
          const lastReadBlock = JSON.stringify(
            { lastBlock: endBlock },
            null,
            2
          );
          fs.writeFileSync(`track.json`, lastReadBlock);
          poolInfoStore.push({
            poolAddress: parsed.poolAddress,
            token0Add: parsed.token0,
            token0Name: token0Info.tokenName,
            token0Symbol: token0Info.tokenSymbol,
            token0Decimal: token0Info.tokenDecimals,
            token1Add: parsed.token1,
            token1Name: token1Info.tokenName,
            token1Symbol: token1Info.tokenSymbol,
            token1Decimal: token1Info.tokenDecimals,
            token0Reserve: reserves.reserve0,
            token1Reserve: reserves.reserve1,
          });

          fs.writeFileSync(
            `${filename}.json`,
            JSON.stringify(poolInfoStore, null, 2)
          );
        } catch (err) {
          console.warn("Event skipped due to error:", err.message);
        }
      }
    } catch (error) {
      console.warn(
        `Error in block range ${startingBlock}-${endBlock}: ${error.message}`
      );
    }

    startingBlock = endBlock + 1;
  }
}

module.exports = processEvents;
