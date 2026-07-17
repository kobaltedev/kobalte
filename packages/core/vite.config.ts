import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [solidPlugin()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["../../node_modules/@testing-library/jest-dom/vitest"],
		isolate: false,
		ssr: {
			noExternal: true,
		},
	},
	resolve: {
		conditions: ["development", "browser"],
		dedupe: ["solid-js"],
	},
});
