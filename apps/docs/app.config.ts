import { nodeTypes } from "@mdx-js/mdx";
import { defineConfig } from "@solidjs/start/config";
// @ts-ignore missing types
import pkg from "@vinxi/plugin-mdx";
import { type Options as AcornOptions, parse } from "acorn";
// @ts-ignore
import Slugger from "github-slugger";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import { visit } from "unist-util-visit";

const { default: vinxiMdx } = pkg;

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
				`export function getHeadings() { return ${JSON.stringify(headings)} }`,
			),
		);
	};
}

export default defineConfig({
	server: {
		preset:
			process.env.GITHUB_ACTIONS || process.env.DEVELOPMENT
				? "node-server"
				: "netlify",
		experimental: {
			asyncContext: true,
		},
		prerender: {
			routes: ["/docs/core/overview/introduction"],
			crawlLinks: true,
		},
	},

	extensions: ["mdx", "md"],
	// @ts-ignore: type should be optional, bugged in @solidjs/start@0.6.1
	solid: {
		extensions: ["mdx", "md"],
	},
	vite() {
		return {
			plugins: [
				vinxiMdx.withImports({})({
					jsx: true,
					jsxImportSource: "solid-js",
					providerImportSource: "solid-mdx",
					rehypePlugins: [
						rehypePrettyCode,
						rehypeSlug,
						[rehypeRaw, { passThrough: nodeTypes }],
						//				rehypeCollectHeadings,
					],
					remarkPlugins: [
						remarkGfm,
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
				//		{
				//			name: "mdx-meta",
				//			async transform(code: any, id: any) {
				//				if (id.endsWith(".mdx?meta") || id.endsWith(".md?meta")) {
				//					const replacedId = id.replace(/\?meta$/, "");
				//
				//					if (headingsCache.has(replacedId)) {
				//						return {
				//							code: `
				//	              export function getHeadings() {
				//									return ${JSON.stringify(headingsCache.get(id), null, 2)}
				//	              }
				//							`,
				//						};
				//					}
				//				}
				//			},
				//		},
			],
			ssr: {
				noExternal: ["@tanstack/solid-virtual"],
			},
		};
	},
});
