import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
  entry: ["src/index.ts"],
});
