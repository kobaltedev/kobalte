import path from "node:path";
import solidPlugin from "@solidjs/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		solidPlugin({
			compiler: "babel",
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
		setupFiles: ["@testing-library/jest-dom/vitest", "./test-setup.ts"],
		isolate: false,
		exclude: ["src/**/*.ssr.test.{ts,tsx}", "node_modules", "dist"],
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
		dedupe: ["solid-js"],
	},
	ssr: {
		noExternal: true,
	},
});
