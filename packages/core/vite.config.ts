import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [solidPlugin()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: [
			"../../node_modules/@testing-library/jest-dom/vitest",
			"./test-setup.ts",
		],
		isolate: false,
	},
	resolve: {
		conditions: ["development", "browser"],
		dedupe: ["solid-js"],
	},
	ssr: {
		noExternal: true,
	},
});
