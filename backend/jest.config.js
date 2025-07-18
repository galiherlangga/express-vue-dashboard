module.exports = {
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.spec.js"],
    setupFilesAfterEnv: ["./tests/setup.js"],
    collectCoverageFrom: ["src/**/*.js", "!src/app.js", "!**/node_modules/**"],
    testTimeout: 30000,
    maxWorkers: 1,
};
