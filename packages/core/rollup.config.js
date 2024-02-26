import cleanup from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";
import license from "rollup-plugin-license";
import withSolid from "rollup-preset-solid";

export default withSolid({
	input: "src/index.tsx",
	targets: ["esm", "cjs"],
	plugins: [
		cleanup({
			comments: "none",
			extensions: ["ts", "tsx"],
		}),
		license({
			banner: `
				MIT License

				Copyright (c) 2022 Fabien Marie-Louise

				License can be found in LICENSE.md,
			  also available at https://github.com/kobaltedev/kobalte/blob/main/LICENSE.md

				This codebase contains modified portions of code from multiple sources.
			  Credits to their original authors.

				A list of all sources and licenses can be found in NOTICE.txt,
			  also available at https://github.com/kobaltedev/kobalte/blob/main/NOTICE.txt
		`,
		}),
		copy({
			targets: [{ src: "../../NOTICE.txt", dest: "." }],
		}),
	],
});
