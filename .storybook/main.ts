import type { StorybookConfig } from "storybook-solidjs-vite";
import { mergeConfig } from "vite";

const SOLID_PRIMITIVES_ROOT = new URL("../../solid-primitives/packages", import.meta.url).pathname;

const config: StorybookConfig = {
	stories: ["../packages/core/src/*/stories/*.stories.{ts,tsx}"],
	staticDirs: ["./public"],
	addons: ["@storybook/addon-docs"],
	framework: {
		name: "storybook-solidjs-vite",
		// docgen: false — storybook-solidjs-vite@10.5.2 bug: dynamic import('typescript')
		// returns { default: ts } in ESM context so ts.sys is undefined inside the plugin
		options: { docgen: false },
	},
	docs: {},
	async viteFinal(config) {
		return mergeConfig(config, {
			plugins: [
				{
					name: "solid-addEventListener-compat",
					transform(code: string, id: string) {
						if (/\.(tsx?|jsx?)$/.test(id) && code.includes("addEventListener as _$addEventListener")) {
							return {
								code: code.replace(
									/\{ addEventListener as _\$addEventListener \}/g,
									"{ addEvent as _$addEventListener }",
								),
								map: null,
							};
						}
					},
				},
				// Intercept any file that imports the removed `on` helper from solid-js.
				// Logs the filename so we can find the culprit, and replaces the import
				// with a shim so rendering continues.
				{
					name: "solid-on-shim",
					transform(code: string, id: string) {
						if (code.includes("from 'solid-js'") || code.includes('from "solid-js"')) {
							if (/\bon\b/.test(code)) {
								const hasOnImport = /import\s*\{[^}]*\bon\b[^}]*\}\s*from\s*['"]solid-js['"]/.test(code);
								if (hasOnImport) {
									console.warn(`[solid-on-shim] Found legacy 'on' import in: ${id}`);
									// Remove 'on' from the import and inject a no-op shim after the import
									const patched = code
										.replace(/,\s*\bon\b/g, "")
										.replace(/\bon\b\s*,/g, "")
										.replace(/\{\s*\bon\b\s*\}/g, "{ createEffect }");
									return { code: patched + "\nconst on = (deps, fn) => { createEffect(deps, fn); };\n", map: null };
								}
							}
						}
					},
				},
			],
			resolve: {
				conditions: ["@solid-primitives/source"],
				alias: [
					{ find: "solid-js/web", replacement: "@solidjs/web" },
					{
						find: "@kobalte/utils",
						replacement: new URL("../packages/utils/src/index.ts", import.meta.url).pathname,
					},
					// Redirect @solid-primitives/<pkg> (top-level only) to local TypeScript source.
					// Transitive deps (event-listener, rootless, static-store, utils) would otherwise
					// fall through to system-level Solid 1.x packages that import the removed `on` export.
					// Subpath exports like @solid-primitives/utils/colors are intentionally NOT matched
					// here — they fall through to Vite package-exports resolution, which uses the
					// "@solid-primitives/source" condition to find the correct TypeScript source file.
					{
						find: /^@solid-primitives\/([^/]+)$/,
						replacement: `${SOLID_PRIMITIVES_ROOT}/$1/src/index.ts`,
					},
				],
				dedupe: ["react", "react-dom"],
			},
		});
	},
};

export default config;
