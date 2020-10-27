const JestConfig = require('vue-cli-plugin-freshinup-ui/utils/testing/jest.config.core')

module.exports = {
  ...JestConfig,
  collectCoverageFrom: JestConfig.collectCoverageFrom.concat([
    'src/**/*.{js,vue}',
    '!src/components/*/index.js'
  ]),
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90
    }
  },
  moduleNameMapper: {
    ...JestConfig.moduleNameMapper,
    'activity-ui/storybook/(.*)$': '<rootDir>/.storybook/$1',
    '@freshinup/activity-ui/src/': '<rooDir>/src/$1',
    '@/components/(.*)$': '<rootDir>/src/components/$1',
    '@/(.*)$': '<rootDir>/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@storybook/.*\\.vue$|vue-cli-plugin-freshinup-ui/.*\\.js|@freshinup/.*\\.vue$|@freshinup/.*\\.js))'
  ]
}
