//// tsup.config.ts
//import { defineConfig } from 'tsup'
//import * as preset from 'tsup-preset-solid'
//import { globSync } from "glob";
//
//const preset_options: preset.PresetOptions = {
//	// array or single object
//	entries: [
//		// default entry (index)
//		{
//			// entries with '.tsx' extension will have `solid` export condition generated
//			entry: "src/index.tsx",
//		}
//	],
//	drop_console: true,
//}
//
//export default defineConfig(config => {
//	const watching = !!config.watch;
//
//	const componentIndexes = globSync('src/*/index.tsx');
//
//	(preset_options.entries as preset.EntryOptions[]).push(...componentIndexes.map(s => ({
//		entry: s,
//	})));
//
//	const parsed_data = preset.parsePresetOptions(preset_options, watching);
//
//	if (!watching) {
//		const package_fields = preset.generatePackageExports(parsed_data);
//
//		console.log(`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`);
//
//		/*
//			will update ./package.json with the correct export fields
//		*/
//		preset.writePackageJson(package_fields);
//	}
//
//	return preset.generateTsupOptions(parsed_data);
//})

import { solidPlugin } from "esbuild-plugin-solid";
/**
 * Adapted from https://github.com/corvudev/corvu/blob/b1f36db096867a88ef5b62bec1e46cc0c8e09089/packages/corvu/tsup.config.ts
 */
import { type Options, defineConfig } from "tsup";

function generateConfig(jsx: boolean): Options {
	return {
		target: "esnext",
		platform: "browser",
		format: "esm",
		clean: true,
		dts: !jsx,
		entry: ["src/index.tsx", "src/*/index.tsx", "src/primitives/*/index.ts"],
		outDir: "dist/",
		treeshake: { preset: "smallest" },
		replaceNodeEnv: true,
		esbuildOptions(options) {
			if (jsx) {
				options.jsx = "preserve";
			}
			options.chunkNames = "[name]/[hash]";
			options.drop = ["console", "debugger"];
		},
		outExtension() {
			return jsx ? { js: ".jsx" } : {};
		},
		// @ts-ignore
		esbuildPlugins: !jsx ? [solidPlugin({ solid: { generate: "dom" } })] : [],
	};
}

export default defineConfig([generateConfig(false), generateConfig(true)]);
