// MIT License
//
// Copyright (c) 2025 KONIVRER Team
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

module.exports = {
  extends: ['eslint:recommended', '@eslint/js/recommended'],
  plugins: ['security', 'no-secrets'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Security rules
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',

    // Secrets detection
    'no-secrets/no-secrets': [
      'error',
      {
        tolerance: 4.2,
        additionalRegexes: {
          'API Key': 'api[_-]?key[\\s]*[:=][\\s]*[\'"][a-zA-Z0-9]{20,}[\'"]',
          'JWT Token': 'eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*',
          'Private Key': '-----BEGIN [A-Z ]+PRIVATE KEY-----',
        },
      },
    ],

    // Additional security-focused rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-alert': 'warn',
  },
  overrides: [
    {
      files: ['**/*.jsx', '**/*.tsx'],
      rules: {
        // React-specific security rules
        'react/no-danger': 'error',
        'react/no-danger-with-children': 'error',
      },
    },
  ],
};
