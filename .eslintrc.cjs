module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: [
    'dist', 
    '.eslintrc.cjs', 
    'node_modules', 
    '*.log', 
    'automation-*.log',
    'vite.config.ts',
    'tsconfig.json'
  ],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off', // Allow console for automation scripts
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },
};