import { defineConfig } from "tsup-preset-solid";

export default defineConfig(
  {
    entry: "src/index.ts",
    dropConsole: true,
  },
  {
    // writePackageJson: true,
  }
);
