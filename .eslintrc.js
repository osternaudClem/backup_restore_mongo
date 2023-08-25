module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/eslint-recommended'],
  plugins: ['import', 'typescript', '@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'init-declarations': 1,
    'import/no-anonymous-default-export': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: 'components',
            group: 'internal',
          },
          {
            pattern: 'common',
            group: 'internal',
          },
          {
            pattern: 'type',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
      },
    ],
  },
};
