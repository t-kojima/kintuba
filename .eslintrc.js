module.exports = {
  env: {
    es6: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['import', 'prettier'],
  rules: {
    'no-console': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
};
