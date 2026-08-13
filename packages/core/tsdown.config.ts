import { defineConfig, type UserConfig } from "tsdown";
import solid from "unplugin-solid/rolldown";

/**
 * Adapted from https://github.com/corvudev/corvu/blob/b1f36db096867a88ef5b62bec1e46cc0c8e09089/packages/corvu/tsup.config.ts
 */
function generateConfig(jsx: boolean): UserConfig {
	return {
		target: "esnext",
		platform: "browser",
		format: ["esm"],
		clean: true,
		dts: !jsx,
		entry: ["src/index.tsx", "src/*/index.tsx", "src/primitives/*/index.ts"],
		outDir: "dist",
		treeshake: true,
		define: {
			"process.env.NODE_ENV": '"production"',
		},
		outExtensions: () => (jsx ? { js: ".jsx" } : {}),
		inputOptions: jsx ? { transform: { jsx: "preserve" } } : undefined,
		outputOptions(options) {
			options.chunkFileNames = jsx ? "[name]/[hash].jsx" : "[name]/[hash].js";
			return options;
		},
		plugins: jsx
			? []
			: [solid({ solid: { generate: "dom", moduleName: "@solidjs/web" } })],
	};
}

export default defineConfig([generateConfig(false), generateConfig(true)]);
