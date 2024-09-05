module.exports = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
    moduleDirectories: ["node_modules", "src"],
    preset: "ts-jest",
    testEnvironment: "node",
  
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest substitutes
    // roots: ["<rootDir>/test/unit"],
  
    // Test file resolution pattern
    // should contain `test`.
    // check the files under /unit and files that has test in their names
    testRegex: "/unit/.*test.ts$",
    modulePaths: ["<rootDir>"],
  
    // Code coverage configuration
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts"],
    coverageThreshold: {
      global: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      },
    },
  
    // Module file extensions for importing
    moduleFileExtensions: ["ts", "js"],
  };
  