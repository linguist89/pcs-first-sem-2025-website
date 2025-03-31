import js from "@eslint/js";

// Most basic configuration to avoid serialization issues
export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Add only essential rules here
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
    ignores: [".next/**", "node_modules/**", "out/**", "public/**"]
  }
];
