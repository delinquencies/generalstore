import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";

export default defineConfig([
  ...next,
  ...ts,
  { files: ["tailwind.config.cjs"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  { rules: { "@next/next/no-img-element": "off", "@next/next/no-page-custom-font": "off" } },
  globalIgnores([".next/**", "next-env.d.ts"]),
]);
