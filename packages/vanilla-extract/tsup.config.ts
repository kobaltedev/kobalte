import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  format: ["esm", "cjs"],
  entry: ["src/index.ts"],
  dts: true,
});
