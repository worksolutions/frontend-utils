module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  moduleNameMapper: {},
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
