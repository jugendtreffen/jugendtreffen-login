// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/web',
  setupFilesAfterEnv: ['<rootDir>/web/src/test/supabaseMock.ts'],
}

module.exports = config
