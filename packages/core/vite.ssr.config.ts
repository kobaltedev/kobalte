import path from "node:path";
import solidPlugin from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		solidPlugin({
			compiler: "babel",
			hot: false,
			solid: {
				generate: "ssr",
				omitNestedClosingTags: false,
				moduleName: "@solidjs/web",
			},
		}),
	],
	test: {
		environment: "node",
		globals: true,
		isolate: false,
		include: ["src/**/*.ssr.test.{ts,tsx}"],
	},
	resolve: {
		alias: {
			"solid-js/web": "@solidjs/web",
			// Use the workspace source of @kobalte/utils so tests run against the
			// Solid 2.0-compatible version rather than the published npm dist.
			"@kobalte/utils": path.resolve(__dirname, "../utils/src/index.ts"),
		},
		conditions: ["node", "development"],
		dedupe: ["solid-js", "@solidjs/web"],
	},
	ssr: {
		noExternal: true,
	},
});
