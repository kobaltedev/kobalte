import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	fixedExtension: false,
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	deps: {
		neverBundle: ["vitest"],
	},
});
