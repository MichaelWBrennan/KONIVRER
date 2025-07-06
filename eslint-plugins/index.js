/**
 * ESLint plugin to enforce TypeScript-only policy
 */

const noJsFiles = require('./no-js-files');

module.exports = {
  rules: {
    'no-js-files': noJsFiles
  },
  configs: {
    recommended: {
      plugins: ['typescript-only'],
      rules: {
        'typescript-only/no-js-files': 'error'
      }
    }
  }
};