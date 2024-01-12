module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "indent": ["warn", 2],
    "max-len": ["error", {code: 260}],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
