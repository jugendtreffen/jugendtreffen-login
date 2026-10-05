// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const preset = require('@redwoodjs/testing/config/jest/web/jest-preset')

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/web',
  // Redwoods eigenes Setup (mockGraphQLQuery, mockCurrentUser, MSW) muss erhalten bleiben
  setupFilesAfterEnv: [
    ...preset.setupFilesAfterEnv,
    '<rootDir>/web/src/test/setupTests.ts',
  ],
}

module.exports = config
