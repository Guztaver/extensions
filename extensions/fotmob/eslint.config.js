const js = require("@eslint/js");
const prettier = require("eslint-config-prettier/flat");
const typescript = require("typescript-eslint");
const raycast = require("@raycast/eslint-plugin");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },
  },
  ...raycast.configs.recommended,
  prettier,
];
