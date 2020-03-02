module.exports = {
    env: {
        es6: true,
        browser: true,
    },
    extends: [
        "standard-react",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        semi: ["error", "always"],
        "no-extra-semi": "error",
    },
};
