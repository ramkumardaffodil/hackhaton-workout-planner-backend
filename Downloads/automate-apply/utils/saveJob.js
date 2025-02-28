const fs = require("fs");
const path = require("path");

const saveFile = (jsonName) => {
  const filePath = path.resolve(__dirname, "..", `json/${jsonName}`);
  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf-8");
    existingData = JSON.parse(fileData);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
  }
  return (job) => {
    existingData.push({
      ...job,
      dateApplied: new Date().toISOString(),
    });
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`Job saved: ${job.title}`);
  };
};

module.exports = {
  saveFile,
};
