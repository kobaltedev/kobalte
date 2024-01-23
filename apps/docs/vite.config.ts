import { nodeTypes } from "@mdx-js/mdx";
import { Options as AcornOptions, parse } from "acorn";
// @ts-ignore
import Slugger from "github-slugger";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
// @ts-ignore
import netlify from "solid-start-netlify";
// @ts-ignore
import node from "solid-start-node";
import solid from "solid-start/vite";
import { visit } from "unist-util-visit";
import { defineConfig } from "vite";

function jsToTreeNode(jsString: string, acornOpts?: AcornOptions) {
	return {
		type: "mdxjsEsm",
		value: "",
		data: {
			estree: {
				body: [],
				...parse(
					jsString,
					acornOpts ?? {
						sourceType: "module",
						ecmaVersion: 2020,
					},
				),
				type: "Program",
				sourceType: "module",
			},
		},
	};
}

async function mdx(config: any) {
	const cache = new Map();
	const headingsCache = new Map();

	function rehypeCollectHeadings() {
		const slugger = new Slugger();
		return (tree: any, file: any) => {
			const headings: any[] = [];
			visit(tree, (node) => {
				if (node.type !== "element") {
					return;
				}

				const { tagName } = node;

				if (tagName[0] !== "h") {
					return;
				}

				const [_, level] = tagName.match(/h([0-6])/) ?? [];

				if (!level) {
					return;
				}

				const depth = Number.parseInt(level);

				let text = "";

				visit(node, (child, __, parent) => {
					if (child.type === "element" || parent == null) {
						return;
					}

					if (child.type === "raw" && child.value.match(/^\n?<.*>\n?$/)) {
						return;
					}

					if (new Set(["text", "raw", "mdxTextExpression"]).has(child.type)) {
						text += child.value;
					}
				});

				node.properties = node.properties || {};

				if (typeof node.properties.id !== "string") {
					let slug = slugger.slug(text);

					if (slug.endsWith("-")) {
						slug = slug.slice(0, -1);
					}

					node.properties.id = slug;
				}

				headings.push({ depth, slug: node.properties.id, text });
			});

			headingsCache.set(file.path, headings);

			tree.children.unshift(
				// @ts-ignore
				jsToTreeNode(
					`export function getHeadings() { return ${JSON.stringify(
						headings,
					)} }`,
				),
			);
		};
	}

	const plugin = {
		...(await import("@mdx-js/rollup")).default({
			jsx: true,
			jsxImportSource: "solid-js",
			providerImportSource: "solid-mdx",
			rehypePlugins: [
				...config.rehypePlugins,
				rehypeSlug,
				rehypeCollectHeadings,
				[rehypeRaw, { passThrough: nodeTypes }],
			],
			remarkPlugins: [
				...config.remarkPlugins,
				[
					// @ts-ignore
					remarkShikiTwoslash.default,
					{
						disableImplicitReactImport: true,
						includeJSDocInHover: true,
						themes: ["github-light", "github-dark"],
						defaultOptions: {
							lib: ["dom", "es2015"],
						},
						defaultCompilerOptions: {
							allowSyntheticDefaultImports: true,
							esModuleInterop: true,
							target: "ESNext",
							module: "ESNext",
							lib: ["dom", "es2015"],
							jsxImportSource: "solid-js",
							jsx: "preserve",
							types: ["vite/client"],
							paths: {
								"~/*": ["./src/*"],
							},
						},
					},
				],
			],
		}),
		enforce: "pre",
	};
	return [
		{
			...plugin,
			async transform(code: any, id: any) {
				if (id.endsWith(".mdx") || id.endsWith(".md")) {
					if (cache.has(code)) {
						return cache.get(code);
					}

					// @ts-ignore
					const result = await plugin.transform?.call(this, code, id);
					cache.set(code, result);

					return result;
				}
			},
		},

		{
			...plugin,
			name: "mdx-meta",
			async transform(code: any, id: any) {
				if (id.endsWith(".mdx?meta") || id.endsWith(".md?meta")) {
					const replacedId = id.replace(/\?meta$/, "");

					function getCode() {
						return `
              export function getHeadings() { return ${JSON.stringify(
								headingsCache.get(replacedId),
								null,
								2,
							)}
              }
              `;
					}

					if (cache.has(code)) {
						return { code: getCode() };
					}

					// @ts-ignore
					const result = await plugin.transform?.call(this, code, replacedId);

					cache.set(code, result);

					return {
						code: getCode(),
					};
				}
			},
		},
	];
}

///

const adapter = process.env.GITHUB_ACTIONS ? node() : netlify();

export default defineConfig({
	plugins: [
		// @ts-ignore
		await mdx({
			rehypePlugins: [rehypePrettyCode],
			remarkPlugins: [remarkGfm],
		}),
		solid({ adapter, ssr: true, extensions: [".mdx", ".md"] }),
	],
	ssr: {
		noExternal: ["@kobalte/core", "@tanstack/solid-virtual"],
	},
});
