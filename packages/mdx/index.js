import { nodeTypes } from "@mdx-js/mdx";
import { parse } from "acorn";
import Slugger from "github-slugger";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import { visit } from "unist-util-visit";

function jsToTreeNode(jsString, acornOpts) {
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
          }
        ),
        type: "Program",
        sourceType: "module",
      },
    },
  };
}

export default async function (config) {
  const cache = new Map();
  const headingsCache = new Map();

  function rehypeCollectHeadings() {
    const slugger = new Slugger();
    return function (tree, file) {
      const headings = [];
      visit(tree, node => {
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
        jsToTreeNode(`export function getHeadings() { return ${JSON.stringify(headings)} }`)
      );
    };
  }
  let plugin = {
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
      async transform(code, id) {
        if (id.endsWith(".mdx") || id.endsWith(".md")) {
          if (cache.has(code)) {
            return cache.get(code);
          }

          let result = await plugin.transform?.call(this, code, id);
          cache.set(code, result);

          return result;
        }
      },
    },

    {
      ...plugin,
      name: "mdx-meta",
      async transform(code, id) {
        if (id.endsWith(".mdx?meta") || id.endsWith(".md?meta")) {
          id = id.replace(/\?meta$/, "");

          // eslint-disable-next-line no-inner-declarations
          function getCode() {
            return `
              export function getHeadings() { return ${JSON.stringify(
                headingsCache.get(id),
                null,
                2
              )}
              }
              `;
          }

          if (cache.has(code)) {
            return { code: getCode() };
          }

          let result = await plugin.transform?.call(this, code, id);

          cache.set(code, result);

          return {
            code: getCode(),
          };
        }
      },
    },
  ];
}
