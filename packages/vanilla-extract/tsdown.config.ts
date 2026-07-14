import { defineConfig } from "tsdown";

export default defineConfig({
	clean: true,
	dts: true,
	format: ["esm", "cjs"],
	fixedExtension: false,
	entry: ["src/index.ts"],
});
