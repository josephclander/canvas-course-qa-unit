const fs = require("fs");
const path = require("path");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function loadLocalConfig() {
  const cwd = process.cwd();

  const courseId = process.env.CANVAS_COURSE_ID;
  if (!courseId) {
    throw new Error("Missing CANVAS_COURSE_ID. Use `npm run course <id>`.");
  }

  const indexPath = path.resolve(cwd, "course-packs", "index.json");
  if (!fs.existsSync(indexPath)) {
    throw new Error("Missing course-packs/index.json");
  }

  const index = readJson(indexPath);
  const packName = index[String(courseId)];

  if (!packName) {
    throw new Error(
      `Course ID ${courseId} not found in course-packs/index.json`
    );
  }

  const configPath = path.resolve(cwd, "course-packs", packName, "config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config not found: ${configPath}`);
  }

  const cfg = readJson(configPath);

  return {
    ...cfg,
    courseId: Number(courseId),
  };
}

module.exports = { loadLocalConfig };
