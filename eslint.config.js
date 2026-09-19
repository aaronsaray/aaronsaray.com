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
      "no-restricted-syntax": [
        "error",
        {
          selector: 'JSXExpressionContainer > Literal[value=" "]',
          message:
            'Prettier writes {" "} when text flows around an inline tag inside an expression. Move that markup into its own component (OldPostNotice.astro is the pattern) and render the component from the expression.',
        },
      ],
    },
  },
  {
    files: ["**/*.mjs", "playwright.config.ts", "tests/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.astro/*.js", "**/*.astro/*.ts"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  eslintConfigPrettier,
);
