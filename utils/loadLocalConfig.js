const fs = require("fs");
const path = require("path");

function loadLocalConfig() {
  const configPath = path.resolve(
    process.cwd(),
    "config",
    "canvas.config.json"
  );

  if (!fs.existsSync(configPath)) {
    throw new Error(
      "Missing config/canvas.config.json. Copy config/canvas.config.example.json to canvas.config.json and fill in your values."
    );
  }

  const raw = fs.readFileSync(configPath, "utf8");
  return JSON.parse(raw);
}

module.exports = { loadLocalConfig };
