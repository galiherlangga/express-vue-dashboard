module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/unit/setup.js"],
  transform: {
    "^.+\\.vue$": "@vue/vue2-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(bootstrap-vue)/)"],
  moduleFileExtensions: ["js", "json", "vue"],
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js,vue}", "!src/main.js"],
  testMatch: ["**/tests/unit/**/*.spec.js"],
};
