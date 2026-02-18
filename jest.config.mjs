// jest.config.js
export default {
  testEnvironment: "node",
  verbose: true,
  silent: true, // set to false while debugging if you want console output
  setupFiles: ["dotenv/config"],
  testMatch: ["**/*.test.js", "**/*.spec.js"],
  transform: {}, // no Babel, pure Node ESM
};
