/** @type {import("eslint").Linter.Config} */
const config = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
    plugins: ["@typescript-eslint"],
    extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
    rules: {
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/consistent-type-imports": [
            "warn",
            {
                prefer: "type-imports",
                fixStyle: "inline-type-imports",
            },
        ],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
            },
        ],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: {
                    attributes: false,
                },
            },
        ],
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
module.exports = config;
