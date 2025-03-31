import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Use a simplified configuration that avoids function serialization issues
export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [".next/**", "node_modules/**"]
  }
];
