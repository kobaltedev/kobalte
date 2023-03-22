// vite.config.ts
import { nodeTypes } from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/@mdx-js+mdx@2.3.0/node_modules/@mdx-js/mdx/index.js";
import { parse } from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/acorn@8.8.2/node_modules/acorn/dist/acorn.mjs";
import Slugger from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/github-slugger@1.5.0/node_modules/github-slugger/index.js";
import rehypePrettyCode from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/rehype-pretty-code@0.9.4_shiki@0.14.1/node_modules/rehype-pretty-code/dist/rehype-pretty-code.js";
import rehypeRaw from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/rehype-raw@6.1.1/node_modules/rehype-raw/index.js";
import rehypeSlug from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/rehype-slug@5.1.0/node_modules/rehype-slug/index.js";
import remarkGfm from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/remark-gfm@3.0.1/node_modules/remark-gfm/index.js";
import remarkShikiTwoslash from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/remark-shiki-twoslash@3.1.1_typescript@4.9.5/node_modules/remark-shiki-twoslash/dist/index.js";
import solid from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/solid-start@0.2.23_45slktl2anvmebb2su2bn6ky3y/node_modules/solid-start/vite/plugin.js";
import node from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/solid-start-node@0.2.23_fdlsukpbdt25cl4l4uiguqn5ny/node_modules/solid-start-node/index.js";
import netlify from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/solid-start-netlify@0.2.23_solid-start@0.2.23/node_modules/solid-start-netlify/index.js";
import { visit } from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/unist-util-visit@4.1.2/node_modules/unist-util-visit/index.js";
import { defineConfig } from "file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/vite@3.2.5/node_modules/vite/dist/node/index.js";
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
            ecmaVersion: 2020
          }
        ),
        type: "Program",
        sourceType: "module"
      }
    }
  };
}
async function mdx(config) {
  const cache = /* @__PURE__ */ new Map();
  const headingsCache = /* @__PURE__ */ new Map();
  function rehypeCollectHeadings() {
    const slugger = new Slugger();
    return function(tree, file) {
      const headings = [];
      visit(tree, (node2) => {
        if (node2.type !== "element") {
          return;
        }
        const { tagName } = node2;
        if (tagName[0] !== "h") {
          return;
        }
        const [_, level] = tagName.match(/h([0-6])/) ?? [];
        if (!level) {
          return;
        }
        const depth = Number.parseInt(level);
        let text = "";
        visit(node2, (child, __, parent) => {
          if (child.type === "element" || parent == null) {
            return;
          }
          if (child.type === "raw" && child.value.match(/^\n?<.*>\n?$/)) {
            return;
          }
          if ((/* @__PURE__ */ new Set(["text", "raw", "mdxTextExpression"])).has(child.type)) {
            text += child.value;
          }
        });
        node2.properties = node2.properties || {};
        if (typeof node2.properties.id !== "string") {
          let slug = slugger.slug(text);
          if (slug.endsWith("-")) {
            slug = slug.slice(0, -1);
          }
          node2.properties.id = slug;
        }
        headings.push({ depth, slug: node2.properties.id, text });
      });
      headingsCache.set(file.path, headings);
      tree.children.unshift(
        jsToTreeNode(`export function getHeadings() { return ${JSON.stringify(headings)} }`)
      );
    };
  }
  const plugin = {
    ...(await import("file:///Users/f.marie-louise/Workspace/kobalte/node_modules/.pnpm/@mdx-js+rollup@2.3.0_rollup@3.20.0/node_modules/@mdx-js/rollup/index.js")).default({
      jsx: true,
      jsxImportSource: "solid-js",
      providerImportSource: "solid-mdx",
      rehypePlugins: [
        ...config.rehypePlugins,
        rehypeSlug,
        rehypeCollectHeadings,
        [rehypeRaw, { passThrough: nodeTypes }]
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
              lib: ["dom", "es2015"]
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
                "~/*": ["./src/*"]
              }
            }
          }
        ]
      ]
    }),
    enforce: "pre"
  };
  return [
    {
      ...plugin,
      async transform(code, id) {
        var _a;
        if (id.endsWith(".mdx") || id.endsWith(".md")) {
          if (cache.has(code)) {
            return cache.get(code);
          }
          const result = await ((_a = plugin.transform) == null ? void 0 : _a.call(this, code, id));
          cache.set(code, result);
          return result;
        }
      }
    },
    {
      ...plugin,
      name: "mdx-meta",
      async transform(code, id) {
        var _a;
        if (id.endsWith(".mdx?meta") || id.endsWith(".md?meta")) {
          let getCode2 = function() {
            return `
              export function getHeadings() { return ${JSON.stringify(
              headingsCache.get(id),
              null,
              2
            )}
              }
              `;
          };
          var getCode = getCode2;
          id = id.replace(/\?meta$/, "");
          if (cache.has(code)) {
            return { code: getCode2() };
          }
          const result = await ((_a = plugin.transform) == null ? void 0 : _a.call(this, code, id));
          cache.set(code, result);
          return {
            code: getCode2()
          };
        }
      }
    }
  ];
}
var adapter = process.env.GITHUB_ACTIONS ? node() : netlify();
var vite_config_default = defineConfig({
  plugins: [
    await mdx({
      rehypePlugins: [rehypePrettyCode],
      remarkPlugins: [remarkGfm]
    }),
    solid({ adapter, extensions: [".mdx", ".md"] })
  ],
  ssr: {
    noExternal: ["@kobalte/core", "@tanstack/solid-virtual"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZi5tYXJpZS1sb3Vpc2UvV29ya3NwYWNlL2tvYmFsdGUvYXBwcy9kb2NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZi5tYXJpZS1sb3Vpc2UvV29ya3NwYWNlL2tvYmFsdGUvYXBwcy9kb2NzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9mLm1hcmllLWxvdWlzZS9Xb3Jrc3BhY2Uva29iYWx0ZS9hcHBzL2RvY3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBub2RlVHlwZXMgfSBmcm9tIFwiQG1keC1qcy9tZHhcIjtcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSBcImFjb3JuXCI7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgU2x1Z2dlciBmcm9tIFwiZ2l0aHViLXNsdWdnZXJcIjtcbmltcG9ydCByZWh5cGVQcmV0dHlDb2RlIGZyb20gXCJyZWh5cGUtcHJldHR5LWNvZGVcIjtcbmltcG9ydCByZWh5cGVSYXcgZnJvbSBcInJlaHlwZS1yYXdcIjtcbmltcG9ydCByZWh5cGVTbHVnIGZyb20gXCJyZWh5cGUtc2x1Z1wiO1xuaW1wb3J0IHJlbWFya0dmbSBmcm9tIFwicmVtYXJrLWdmbVwiO1xuaW1wb3J0IHJlbWFya1NoaWtpVHdvc2xhc2ggZnJvbSBcInJlbWFyay1zaGlraS10d29zbGFzaFwiO1xuaW1wb3J0IHNvbGlkIGZyb20gXCJzb2xpZC1zdGFydC92aXRlXCI7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgbm9kZSBmcm9tIFwic29saWQtc3RhcnQtbm9kZVwiO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IG5ldGxpZnkgZnJvbSBcInNvbGlkLXN0YXJ0LW5ldGxpZnlcIjtcbmltcG9ydCB7IHZpc2l0IH0gZnJvbSBcInVuaXN0LXV0aWwtdmlzaXRcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5cbmZ1bmN0aW9uIGpzVG9UcmVlTm9kZShqc1N0cmluZzogYW55LCBhY29ybk9wdHM6IGFueSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFwibWR4anNFc21cIixcbiAgICB2YWx1ZTogXCJcIixcbiAgICBkYXRhOiB7XG4gICAgICBlc3RyZWU6IHtcbiAgICAgICAgYm9keTogW10sXG4gICAgICAgIC4uLnBhcnNlKFxuICAgICAgICAgIGpzU3RyaW5nLFxuICAgICAgICAgIGFjb3JuT3B0cyA/PyB7XG4gICAgICAgICAgICBzb3VyY2VUeXBlOiBcIm1vZHVsZVwiLFxuICAgICAgICAgICAgZWNtYVZlcnNpb246IDIwMjAsXG4gICAgICAgICAgfVxuICAgICAgICApLFxuICAgICAgICB0eXBlOiBcIlByb2dyYW1cIixcbiAgICAgICAgc291cmNlVHlwZTogXCJtb2R1bGVcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWR4KGNvbmZpZzogYW55KSB7XG4gIGNvbnN0IGNhY2hlID0gbmV3IE1hcCgpO1xuICBjb25zdCBoZWFkaW5nc0NhY2hlID0gbmV3IE1hcCgpO1xuXG4gIGZ1bmN0aW9uIHJlaHlwZUNvbGxlY3RIZWFkaW5ncygpIHtcbiAgICBjb25zdCBzbHVnZ2VyID0gbmV3IFNsdWdnZXIoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRyZWU6IGFueSwgZmlsZTogYW55KSB7XG4gICAgICBjb25zdCBoZWFkaW5nczogYW55W10gPSBbXTtcbiAgICAgIHZpc2l0KHRyZWUsIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS50eXBlICE9PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgdGFnTmFtZSB9ID0gbm9kZTtcblxuICAgICAgICBpZiAodGFnTmFtZVswXSAhPT0gXCJoXCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbXywgbGV2ZWxdID0gdGFnTmFtZS5tYXRjaCgvaChbMC02XSkvKSA/PyBbXTtcblxuICAgICAgICBpZiAoIWxldmVsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVwdGggPSBOdW1iZXIucGFyc2VJbnQobGV2ZWwpO1xuXG4gICAgICAgIGxldCB0ZXh0ID0gXCJcIjtcblxuICAgICAgICB2aXNpdChub2RlLCAoY2hpbGQsIF9fLCBwYXJlbnQpID0+IHtcbiAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gXCJlbGVtZW50XCIgfHwgcGFyZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gXCJyYXdcIiAmJiBjaGlsZC52YWx1ZS5tYXRjaCgvXlxcbj88Lio+XFxuPyQvKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXcgU2V0KFtcInRleHRcIiwgXCJyYXdcIiwgXCJtZHhUZXh0RXhwcmVzc2lvblwiXSkuaGFzKGNoaWxkLnR5cGUpKSB7XG4gICAgICAgICAgICB0ZXh0ICs9IGNoaWxkLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gbm9kZS5wcm9wZXJ0aWVzIHx8IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygbm9kZS5wcm9wZXJ0aWVzLmlkICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgbGV0IHNsdWcgPSBzbHVnZ2VyLnNsdWcodGV4dCk7XG5cbiAgICAgICAgICBpZiAoc2x1Zy5lbmRzV2l0aChcIi1cIikpIHtcbiAgICAgICAgICAgIHNsdWcgPSBzbHVnLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBub2RlLnByb3BlcnRpZXMuaWQgPSBzbHVnO1xuICAgICAgICB9XG5cbiAgICAgICAgaGVhZGluZ3MucHVzaCh7IGRlcHRoLCBzbHVnOiBub2RlLnByb3BlcnRpZXMuaWQsIHRleHQgfSk7XG4gICAgICB9KTtcblxuICAgICAgaGVhZGluZ3NDYWNoZS5zZXQoZmlsZS5wYXRoLCBoZWFkaW5ncyk7XG5cbiAgICAgIHRyZWUuY2hpbGRyZW4udW5zaGlmdChcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBqc1RvVHJlZU5vZGUoYGV4cG9ydCBmdW5jdGlvbiBnZXRIZWFkaW5ncygpIHsgcmV0dXJuICR7SlNPTi5zdHJpbmdpZnkoaGVhZGluZ3MpfSB9YClcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHBsdWdpbiA9IHtcbiAgICAuLi4oYXdhaXQgaW1wb3J0KFwiQG1keC1qcy9yb2xsdXBcIikpLmRlZmF1bHQoe1xuICAgICAganN4OiB0cnVlLFxuICAgICAganN4SW1wb3J0U291cmNlOiBcInNvbGlkLWpzXCIsXG4gICAgICBwcm92aWRlckltcG9ydFNvdXJjZTogXCJzb2xpZC1tZHhcIixcbiAgICAgIHJlaHlwZVBsdWdpbnM6IFtcbiAgICAgICAgLi4uY29uZmlnLnJlaHlwZVBsdWdpbnMsXG4gICAgICAgIHJlaHlwZVNsdWcsXG4gICAgICAgIHJlaHlwZUNvbGxlY3RIZWFkaW5ncyxcbiAgICAgICAgW3JlaHlwZVJhdywgeyBwYXNzVGhyb3VnaDogbm9kZVR5cGVzIH1dLFxuICAgICAgXSxcbiAgICAgIHJlbWFya1BsdWdpbnM6IFtcbiAgICAgICAgLi4uY29uZmlnLnJlbWFya1BsdWdpbnMsXG4gICAgICAgIFtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgcmVtYXJrU2hpa2lUd29zbGFzaC5kZWZhdWx0LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRpc2FibGVJbXBsaWNpdFJlYWN0SW1wb3J0OiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZUpTRG9jSW5Ib3ZlcjogdHJ1ZSxcbiAgICAgICAgICAgIHRoZW1lczogW1wiZ2l0aHViLWxpZ2h0XCIsIFwiZ2l0aHViLWRhcmtcIl0sXG4gICAgICAgICAgICBkZWZhdWx0T3B0aW9uczoge1xuICAgICAgICAgICAgICBsaWI6IFtcImRvbVwiLCBcImVzMjAxNVwiXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWZhdWx0Q29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICAgIGFsbG93U3ludGhldGljRGVmYXVsdEltcG9ydHM6IHRydWUsXG4gICAgICAgICAgICAgIGVzTW9kdWxlSW50ZXJvcDogdHJ1ZSxcbiAgICAgICAgICAgICAgdGFyZ2V0OiBcIkVTTmV4dFwiLFxuICAgICAgICAgICAgICBtb2R1bGU6IFwiRVNOZXh0XCIsXG4gICAgICAgICAgICAgIGxpYjogW1wiZG9tXCIsIFwiZXMyMDE1XCJdLFxuICAgICAgICAgICAgICBqc3hJbXBvcnRTb3VyY2U6IFwic29saWQtanNcIixcbiAgICAgICAgICAgICAganN4OiBcInByZXNlcnZlXCIsXG4gICAgICAgICAgICAgIHR5cGVzOiBbXCJ2aXRlL2NsaWVudFwiXSxcbiAgICAgICAgICAgICAgcGF0aHM6IHtcbiAgICAgICAgICAgICAgICBcIn4vKlwiOiBbXCIuL3NyYy8qXCJdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICB9KSxcbiAgICBlbmZvcmNlOiBcInByZVwiLFxuICB9O1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIC4uLnBsdWdpbixcbiAgICAgIGFzeW5jIHRyYW5zZm9ybShjb2RlOiBhbnksIGlkOiBhbnkpIHtcbiAgICAgICAgaWYgKGlkLmVuZHNXaXRoKFwiLm1keFwiKSB8fCBpZC5lbmRzV2l0aChcIi5tZFwiKSkge1xuICAgICAgICAgIGlmIChjYWNoZS5oYXMoY29kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZS5nZXQoY29kZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBsdWdpbi50cmFuc2Zvcm0/LmNhbGwodGhpcywgY29kZSwgaWQpO1xuICAgICAgICAgIGNhY2hlLnNldChjb2RlLCByZXN1bHQpO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgLi4ucGx1Z2luLFxuICAgICAgbmFtZTogXCJtZHgtbWV0YVwiLFxuICAgICAgYXN5bmMgdHJhbnNmb3JtKGNvZGU6IGFueSwgaWQ6IGFueSkge1xuICAgICAgICBpZiAoaWQuZW5kc1dpdGgoXCIubWR4P21ldGFcIikgfHwgaWQuZW5kc1dpdGgoXCIubWQ/bWV0YVwiKSkge1xuICAgICAgICAgIGlkID0gaWQucmVwbGFjZSgvXFw/bWV0YSQvLCBcIlwiKTtcblxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1pbm5lci1kZWNsYXJhdGlvbnNcbiAgICAgICAgICBmdW5jdGlvbiBnZXRDb2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGdldEhlYWRpbmdzKCkgeyByZXR1cm4gJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICBoZWFkaW5nc0NhY2hlLmdldChpZCksXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAyXG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2FjaGUuaGFzKGNvZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBjb2RlOiBnZXRDb2RlKCkgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcGx1Z2luLnRyYW5zZm9ybT8uY2FsbCh0aGlzLCBjb2RlLCBpZCk7XG5cbiAgICAgICAgICBjYWNoZS5zZXQoY29kZSwgcmVzdWx0KTtcblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2RlOiBnZXRDb2RlKCksXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICBdO1xufVxuXG4vLy9cblxuY29uc3QgYWRhcHRlciA9IHByb2Nlc3MuZW52LkdJVEhVQl9BQ1RJT05TID8gbm9kZSgpIDogbmV0bGlmeSgpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgYXdhaXQgbWR4KHtcbiAgICAgIHJlaHlwZVBsdWdpbnM6IFtyZWh5cGVQcmV0dHlDb2RlXSxcbiAgICAgIHJlbWFya1BsdWdpbnM6IFtyZW1hcmtHZm1dLFxuICAgIH0pLFxuICAgIHNvbGlkKHsgYWRhcHRlciwgZXh0ZW5zaW9uczogW1wiLm1keFwiLCBcIi5tZFwiXSB9KSxcbiAgXSxcbiAgc3NyOiB7XG4gICAgbm9FeHRlcm5hbDogW1wiQGtvYmFsdGUvY29yZVwiLCBcIkB0YW5zdGFjay9zb2xpZC12aXJ0dWFsXCJdLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFVLFNBQVMsaUJBQWlCO0FBQy9WLFNBQVMsYUFBYTtBQUV0QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxzQkFBc0I7QUFDN0IsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZUFBZTtBQUN0QixPQUFPLHlCQUF5QjtBQUNoQyxPQUFPLFdBQVc7QUFFbEIsT0FBTyxVQUFVO0FBRWpCLE9BQU8sYUFBYTtBQUNwQixTQUFTLGFBQWE7QUFDdEIsU0FBUyxvQkFBb0I7QUFFN0IsU0FBUyxhQUFhLFVBQWUsV0FBZ0I7QUFDbkQsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osUUFBUTtBQUFBLFFBQ04sTUFBTSxDQUFDO0FBQUEsUUFDUCxHQUFHO0FBQUEsVUFDRDtBQUFBLFVBQ0EsYUFBYTtBQUFBLFlBQ1gsWUFBWTtBQUFBLFlBQ1osYUFBYTtBQUFBLFVBQ2Y7QUFBQSxRQUNGO0FBQUEsUUFDQSxNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxlQUFlLElBQUksUUFBYTtBQUM5QixRQUFNLFFBQVEsb0JBQUksSUFBSTtBQUN0QixRQUFNLGdCQUFnQixvQkFBSSxJQUFJO0FBRTlCLFdBQVMsd0JBQXdCO0FBQy9CLFVBQU0sVUFBVSxJQUFJLFFBQVE7QUFDNUIsV0FBTyxTQUFVLE1BQVcsTUFBVztBQUNyQyxZQUFNLFdBQWtCLENBQUM7QUFDekIsWUFBTSxNQUFNLENBQUFBLFVBQVE7QUFDbEIsWUFBSUEsTUFBSyxTQUFTLFdBQVc7QUFDM0I7QUFBQSxRQUNGO0FBRUEsY0FBTSxFQUFFLFFBQVEsSUFBSUE7QUFFcEIsWUFBSSxRQUFRLE9BQU8sS0FBSztBQUN0QjtBQUFBLFFBQ0Y7QUFFQSxjQUFNLENBQUMsR0FBRyxLQUFLLElBQUksUUFBUSxNQUFNLFVBQVUsS0FBSyxDQUFDO0FBRWpELFlBQUksQ0FBQyxPQUFPO0FBQ1Y7QUFBQSxRQUNGO0FBRUEsY0FBTSxRQUFRLE9BQU8sU0FBUyxLQUFLO0FBRW5DLFlBQUksT0FBTztBQUVYLGNBQU1BLE9BQU0sQ0FBQyxPQUFPLElBQUksV0FBVztBQUNqQyxjQUFJLE1BQU0sU0FBUyxhQUFhLFVBQVUsTUFBTTtBQUM5QztBQUFBLFVBQ0Y7QUFFQSxjQUFJLE1BQU0sU0FBUyxTQUFTLE1BQU0sTUFBTSxNQUFNLGNBQWMsR0FBRztBQUM3RDtBQUFBLFVBQ0Y7QUFFQSxlQUFJLG9CQUFJLElBQUksQ0FBQyxRQUFRLE9BQU8sbUJBQW1CLENBQUMsR0FBRSxJQUFJLE1BQU0sSUFBSSxHQUFHO0FBQ2pFLG9CQUFRLE1BQU07QUFBQSxVQUNoQjtBQUFBLFFBQ0YsQ0FBQztBQUVELFFBQUFBLE1BQUssYUFBYUEsTUFBSyxjQUFjLENBQUM7QUFFdEMsWUFBSSxPQUFPQSxNQUFLLFdBQVcsT0FBTyxVQUFVO0FBQzFDLGNBQUksT0FBTyxRQUFRLEtBQUssSUFBSTtBQUU1QixjQUFJLEtBQUssU0FBUyxHQUFHLEdBQUc7QUFDdEIsbUJBQU8sS0FBSyxNQUFNLEdBQUcsRUFBRTtBQUFBLFVBQ3pCO0FBRUEsVUFBQUEsTUFBSyxXQUFXLEtBQUs7QUFBQSxRQUN2QjtBQUVBLGlCQUFTLEtBQUssRUFBRSxPQUFPLE1BQU1BLE1BQUssV0FBVyxJQUFJLEtBQUssQ0FBQztBQUFBLE1BQ3pELENBQUM7QUFFRCxvQkFBYyxJQUFJLEtBQUssTUFBTSxRQUFRO0FBRXJDLFdBQUssU0FBUztBQUFBLFFBRVosYUFBYSwwQ0FBMEMsS0FBSyxVQUFVLFFBQVEsS0FBSztBQUFBLE1BQ3JGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxRQUFNLFNBQVM7QUFBQSxJQUNiLElBQUksTUFBTSxPQUFPLDhJQUFtQixRQUFRO0FBQUEsTUFDMUMsS0FBSztBQUFBLE1BQ0wsaUJBQWlCO0FBQUEsTUFDakIsc0JBQXNCO0FBQUEsTUFDdEIsZUFBZTtBQUFBLFFBQ2IsR0FBRyxPQUFPO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxRQUNBLENBQUMsV0FBVyxFQUFFLGFBQWEsVUFBVSxDQUFDO0FBQUEsTUFDeEM7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNiLEdBQUcsT0FBTztBQUFBLFFBQ1Y7QUFBQSxVQUVFLG9CQUFvQjtBQUFBLFVBQ3BCO0FBQUEsWUFDRSw0QkFBNEI7QUFBQSxZQUM1QixxQkFBcUI7QUFBQSxZQUNyQixRQUFRLENBQUMsZ0JBQWdCLGFBQWE7QUFBQSxZQUN0QyxnQkFBZ0I7QUFBQSxjQUNkLEtBQUssQ0FBQyxPQUFPLFFBQVE7QUFBQSxZQUN2QjtBQUFBLFlBQ0Esd0JBQXdCO0FBQUEsY0FDdEIsOEJBQThCO0FBQUEsY0FDOUIsaUJBQWlCO0FBQUEsY0FDakIsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsS0FBSyxDQUFDLE9BQU8sUUFBUTtBQUFBLGNBQ3JCLGlCQUFpQjtBQUFBLGNBQ2pCLEtBQUs7QUFBQSxjQUNMLE9BQU8sQ0FBQyxhQUFhO0FBQUEsY0FDckIsT0FBTztBQUFBLGdCQUNMLE9BQU8sQ0FBQyxTQUFTO0FBQUEsY0FDbkI7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxTQUFTO0FBQUEsRUFDWDtBQUNBLFNBQU87QUFBQSxJQUNMO0FBQUEsTUFDRSxHQUFHO0FBQUEsTUFDSCxNQUFNLFVBQVUsTUFBVyxJQUFTO0FBdEoxQztBQXVKUSxZQUFJLEdBQUcsU0FBUyxNQUFNLEtBQUssR0FBRyxTQUFTLEtBQUssR0FBRztBQUM3QyxjQUFJLE1BQU0sSUFBSSxJQUFJLEdBQUc7QUFDbkIsbUJBQU8sTUFBTSxJQUFJLElBQUk7QUFBQSxVQUN2QjtBQUdBLGdCQUFNLFNBQVMsUUFBTSxZQUFPLGNBQVAsbUJBQWtCLEtBQUssTUFBTSxNQUFNO0FBQ3hELGdCQUFNLElBQUksTUFBTSxNQUFNO0FBRXRCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFQTtBQUFBLE1BQ0UsR0FBRztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sTUFBTSxVQUFVLE1BQVcsSUFBUztBQXhLMUM7QUF5S1EsWUFBSSxHQUFHLFNBQVMsV0FBVyxLQUFLLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFJdkQsY0FBU0MsV0FBVCxXQUFtQjtBQUNqQixtQkFBTztBQUFBLHVEQUNvQyxLQUFLO0FBQUEsY0FDNUMsY0FBYyxJQUFJLEVBQUU7QUFBQSxjQUNwQjtBQUFBLGNBQ0E7QUFBQSxZQUNGO0FBQUE7QUFBQTtBQUFBLFVBR0o7QUFUUyx3QkFBQUE7QUFIVCxlQUFLLEdBQUcsUUFBUSxXQUFXLEVBQUU7QUFjN0IsY0FBSSxNQUFNLElBQUksSUFBSSxHQUFHO0FBQ25CLG1CQUFPLEVBQUUsTUFBTUEsU0FBUSxFQUFFO0FBQUEsVUFDM0I7QUFHQSxnQkFBTSxTQUFTLFFBQU0sWUFBTyxjQUFQLG1CQUFrQixLQUFLLE1BQU0sTUFBTTtBQUV4RCxnQkFBTSxJQUFJLE1BQU0sTUFBTTtBQUV0QixpQkFBTztBQUFBLFlBQ0wsTUFBTUEsU0FBUTtBQUFBLFVBQ2hCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBSUEsSUFBTSxVQUFVLFFBQVEsSUFBSSxpQkFBaUIsS0FBSyxJQUFJLFFBQVE7QUFFOUQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTSxJQUFJO0FBQUEsTUFDUixlQUFlLENBQUMsZ0JBQWdCO0FBQUEsTUFDaEMsZUFBZSxDQUFDLFNBQVM7QUFBQSxJQUMzQixDQUFDO0FBQUEsSUFDRCxNQUFNLEVBQUUsU0FBUyxZQUFZLENBQUMsUUFBUSxLQUFLLEVBQUUsQ0FBQztBQUFBLEVBQ2hEO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxZQUFZLENBQUMsaUJBQWlCLHlCQUF5QjtBQUFBLEVBQ3pEO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsibm9kZSIsICJnZXRDb2RlIl0KfQo=
