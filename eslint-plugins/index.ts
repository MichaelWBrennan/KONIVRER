/**
 * ESLint plugin to enforce TypeScript-only policy
 */

import noJsFiles from './no-js-files';

export default {
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