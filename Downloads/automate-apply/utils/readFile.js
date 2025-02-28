const fs = require("fs");
const path = require("path");

class FileHandler {
  filePath = "";

  constructor(fileName, isCompany) {
    if (isCompany) {
      this.filePath = path.resolve(
        __dirname,
        "..",
        `json/emailSent/${fileName}`
      );
    } else {
      this.filePath = path.resolve(__dirname, "..", `json/${fileName}`);
    }
  }

  readFile() {
    if (fs.existsSync(this.filePath)) {
      return fs.readFileSync(this.filePath, "utf-8");
    } else {
      this.saveFile([]);
      return fs.readFileSync(this.filePath, "utf-8");
    }
  }

  saveFile(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}

export default FileHandler;
