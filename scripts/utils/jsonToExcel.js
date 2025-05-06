const XLSX = require("xlsx");
const fs = require("fs");
const DexName_ChainName = require("../../data/Wagmi-Kava-14537291-50.json");
/**
 * jsonToXlsx() creates a .xlsx from a json file.
 * @param {object} jsonData json need to dump into a .xlsx file
 * @param {string} outputFilePath name of the .xlsx file.
 */
function jsonToXlsx(jsonData, outputFilePath) {
  // Ensure the directory exists
  const dir = "pool-data";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a file
  XLSX.writeFile(workbook, outputFilePath);

  console.log(`File saved as ${outputFilePath}`);
}

// Export to the pool-data folder
jsonToXlsx(DexName_ChainName, "pool-data/Wagmi-Kava-8.xlsx");
