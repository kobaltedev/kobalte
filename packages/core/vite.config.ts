import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [solidPlugin()],
	server: {
		port: 4000,
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["../../node_modules/@testing-library/jest-dom/vitest"],
		isolate: false,
		watch: false,
	},
	resolve: {
		conditions: ["development", "browser"],
	},
});
