/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@sacred-craft/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "turbo/no-undeclared-env-vars": [
      "error",
      {
        allowList: ["ENV"],
      },
    ],
  },
};
