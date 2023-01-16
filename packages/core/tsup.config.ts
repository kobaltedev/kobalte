import { defineConfig } from "tsup-preset-solid";

export default defineConfig(
  {
    entry: "src/index.tsx",
    devEntry: true,
    dropConsole: true,
  },
  {
    // writePackageJson: true,
  }
);
