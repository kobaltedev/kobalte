import solidPlugin from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [solidPlugin({ compiler: "babel" })],
	build: {
		target: "esnext",
	},
});
