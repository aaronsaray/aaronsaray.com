import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      ".astro/",
      ".migration/hugo-baseline/",
      ".playwright-mcp/",
      ".design/",
      "public/",
      "src/content/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    // Build-time code runs under Node.
    files: ["**/*.mjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Client-side <script> content in .astro files runs in the browser.
    files: ["**/*.astro/*.js", "**/*.astro/*.ts"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // CLI verification scripts print their results.
    files: [".migration/**"],
    rules: {
      "no-console": "off",
    },
  },
  eslintConfigPrettier,
);
