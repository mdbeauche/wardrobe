module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'plugin:import/react', 'prettier'],
  globals: { fetch: false },
  plugins: ['react', 'prettier'],
  env: {
    jest: true,
    browser: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  rules: {
    'no-console': 'off',
    'max-len': [2, 100, 2],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'function-paren-newline': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    'no-underscore-dangle': 0,
    'class-methods-use-this': 'off',
    'arrow-parens': 'off',
    'no-param-reassign': 0,
    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    'no-restricted-syntax': 0,
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/require-default-props': 0,
    'no-unused-expressions': 'error',
    'import/no-unresolved': [2, { caseSensitive: false }],
  },
};
