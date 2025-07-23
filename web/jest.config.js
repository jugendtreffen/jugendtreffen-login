// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/web',
  setupFilesAfterEnv: ['./src/test/supabaseMock.ts'],
}

module.exports = config
