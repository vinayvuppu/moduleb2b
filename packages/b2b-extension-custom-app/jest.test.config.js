const path = require('path');
const preset = require('@commercetools-frontend/jest-preset-mc-app');

module.exports = {
  ...preset,
  transform: {
    ...preset.transform,
    '^.+\\.pegjs$': 'pegjs-jest',
  },
  moduleDirectories: [
    'packages-application',
    'packages-shared',
    'node_modules',
  ],
  modulePathIgnorePatterns: ["<rootDir>/.*/__mocks__"],
  setupFiles: [path.resolve(__dirname,'jest-ignore-warnings.js')],
  testPathIgnorePatterns: ["packages-shared"],
  transformIgnorePatterns: [`node_modules/(?!(@commercetools-local)/)`],
};
