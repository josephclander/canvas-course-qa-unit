// tools/run-course.js
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI: npm run course <courseId> [-- <jest args>]
const courseId = process.argv[2];

if (!courseId) {
  console.error("Usage: npm run course <courseId> [-- <jest args>]");
  console.error("Example: npm run course 600");
  console.error(
    'Example: npm run course 600 -- --testNamePattern="Course settings"',
  );
  process.exit(1);
}

const extraArgs = process.argv.slice(3);
const jestArgs = extraArgs[0] === "--" ? extraArgs.slice(1) : extraArgs;

const jestBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "jest",
  "bin",
  "jest.js",
);

const nodeArgs = [
  "--experimental-vm-modules",
  jestBin,
  "--config",
  "jest.config.mjs",
  ...jestArgs,
];

const { status } = spawnSync(process.execPath, nodeArgs, {
  stdio: "inherit",
  env: { ...process.env, CANVAS_COURSE_ID: String(courseId) },
});

process.exit(status ?? 1);
