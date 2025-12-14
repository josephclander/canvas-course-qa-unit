// tools/run-course.js
const { spawnSync } = require("child_process");

const courseId = process.argv[2];

if (!courseId) {
  console.error("Usage: npm run course <courseId> [-- <jest args>]");
  console.error("Example: npm run course 123");
  console.error("Example: npm run course 123 -- course");
  process.exit(1);
}

// Everything after the courseId should be passed through to `npm test`.
// We support the common `--` separator but do not require it.
const extraArgs = process.argv.slice(3);

// If user included `--`, remove it so it does not confuse anything.
const jestArgs = extraArgs[0] === "--" ? extraArgs.slice(1) : extraArgs;

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

// Forward args to npm test using `--` so npm passes them to jest.
const args = jestArgs.length > 0 ? ["test", "--", ...jestArgs] : ["test"];

const result = spawnSync(npmCmd, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    CANVAS_COURSE_ID: String(courseId),
  },
});

process.exit(result.status ?? 1);
