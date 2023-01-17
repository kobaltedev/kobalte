import { defineConfig } from "tsup-preset-solid";

export default defineConfig(
  {
    entry: "src/index.ts",
  },
  {
    // writePackageJson: true,
    dropConsole: true,
    cjs: true,
  }
);
