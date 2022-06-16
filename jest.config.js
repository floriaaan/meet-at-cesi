module.exports = {
  roots: ["./"],
  preset: "ts-jest/presets/js-with-babel",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  testPathIgnorePatterns: ["e2e", "node_modules", ".next", "pages"],
  coverageReporters: ["html", "text-summary"],
};
