import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		solidPlugin({
			hot: false,
			solid: { generate: "dom", omitNestedClosingTags: false, moduleName: "@solidjs/web" },
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
		},
		conditions: ["development", "browser"],
	},
});
