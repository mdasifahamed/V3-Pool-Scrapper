const lodash = require("lodash");
const processEvents = require("./processEvents");
const addresses = require("../ADRESS.json");
const chainMap = require("../map.json");
const rprUrl = require("../MainnetUrls.json");
const defiName = process.argv[2];
const chainName = process.argv[3];
const blockNumber = process.argv[4];
const range = process.argv[5];

async function main() {
  const network = chainMap[chainName.toLocaleLowerCase()];
  if (!network) {
    throw new Error("Invalid Chain Name");
  }

  const defiAddresses = addresses[lodash.startCase(defiName)];
  if (!defiAddresses) {
    throw new Error("Invalid Defi Name");
  }

  const factoryAddress = defiAddresses[network];
  if (!factoryAddress) {
    throw new Error(
      "Factory Address not found for the specified Defi Name and Network"
    );
  }
  const provider_url = rprUrl[network];

  if (isNaN(parseInt(blockNumber)) || isNaN(parseInt(range))) {
    throw new Error("Invalid Starting Block Or Range Number");
  }
  const fileName = `${lodash.startCase(
    defiName
  )}-${network}-${blockNumber}-${range}`;
  await processEvents(
    provider_url,
    factoryAddress,
    parseInt(range),
    parseInt(blockNumber),
    fileName
  );
}

main().catch((err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});
