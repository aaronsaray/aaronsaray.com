import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist/",
      ".astro/",
      ".playwright-mcp/",
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
      "no-console": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: 'JSXExpressionContainer > Literal[value=" "]',
          message:
            'Prettier writes {" "} when it wraps text beside an inline tag inside an expression. Delete it and keep the line break; compressHTML renders the break as a space.',
        },
      ],
    },
  },
  eslintConfigPrettier,
  // Last, because eslintConfigPrettier turns curly off.
  { rules: { curly: ["error", "all"] } },
);
