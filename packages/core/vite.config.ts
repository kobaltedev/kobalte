import path from "node:path";
import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		solidPlugin({
			hot: false,
			solid: {
				generate: "dom",
				omitNestedClosingTags: false,
				moduleName: "@solidjs/web",
			},
		}),
	],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["@testing-library/jest-dom/vitest"],
		isolate: false,
		transformMode: {
			web: [/\.[jt]sx$/],
		},
	},
	resolve: {
		alias: {
			"solid-js/web": "@solidjs/web",
			// Use the workspace source of @kobalte/utils so tests run against the
			// Solid 2.0-compatible version rather than the published npm dist.
			"@kobalte/utils": path.resolve(__dirname, "../utils/src/index.ts"),
		},
		conditions: ["development", "browser"],
	},
});
