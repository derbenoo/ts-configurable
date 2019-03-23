module.exports = {
  name: 'ts-configurable',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ts-configurable',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
