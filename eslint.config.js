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
      ".playwright-mcp/",
      "playwright-report/",
      "public/",
      "src/content/",
      "test-results/",
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
    // Build-time and test code runs under Node.
    files: ["**/*.mjs", "playwright.config.ts", "tests/**/*.ts"],
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
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
  eslintConfigPrettier,
);
