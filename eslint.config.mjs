import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: ["src/components/ui/**/*"],
  },
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "standard",
      "prettier",
    ],
    rules: {
      "no-undef": "off", //  TypeScript handle this
      "no-unused-vars": "off", // Handled by TypeScript rule
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      quotes: ["error", "double"],
      "prefer-template": ["error"],
      "prefer-arrow-callback": ["error"],
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "arrow-body-style": ["error", "as-needed"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
          ],

          "newlines-between": "always",

          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],

          pathGroupsExcludedImportTypes: ["builtin"],

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "comma-dangle": "off",
    },
  }),
];

export default eslintConfig;
