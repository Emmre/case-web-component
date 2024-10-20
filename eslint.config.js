/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: require('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            [
              '@babel/plugin-proposal-decorators',
              { decoratorsBeforeExport: true },
            ],
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      lit: require('eslint-plugin-lit'),
      prettier: require('eslint-plugin-prettier'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'arrow-parens': ['error', 'as-needed'],
      'lit/no-template-bind': 'off',
      'lit/binding-positions': 'warn',
    },
  },
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
      'prettier/prettier': 'off',
    },
  },
];

module.exports = config;
