module.exports = {
  'roots': ['<rootDir>'],
  // 'transform': { '^.+\\.ts?$': 'ts-jest' },
  'moduleFileExtensions': [
    'js',
    'ts',
  ],
  'coveragePathIgnorePatterns': [
    '/node_modules/',
  ],
  'testPathIgnorePatterns': [
    '/node_modules/',
    'components',
  ],
  'testMatch': [
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  'collectCoverageFrom': [
    '**/core/**.{js,jsx,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  'coverageDirectory': './coverage/',
};