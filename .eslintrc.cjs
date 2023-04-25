module.exports = {
  parserOptions: { sourceType: "module" },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "foxkit",
    "foxkit/ts",
    "prettier"
  ],
  overrides: [
    {
      files: ["**/*.ts"],
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      },
      rules: {
        "no-undef": "off",
        "no-redeclare": "off",
        "dot-notation": "off",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-optional-chain": "warn",
        "@typescript-eslint/consistent-type-exports": [
          "warn",
          { fixMixedExportsWithInlineTypeSpecifier: false }
        ],
        "@typescript-eslint/consistent-type-imports": ["error"],
        "@typescript-eslint/consistent-generic-constructors": "warn",
        "@typescript-eslint/no-misused-promises": "warn",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "warn",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/dot-notation": "warn"
      }
    }
  ]
};
