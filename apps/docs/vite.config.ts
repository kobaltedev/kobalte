import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { version as KBVersion } from "../../packages/core/package.json";
import { solidBase } from "@kobalte/solidbase/config";
import { createFilesystemSidebar } from "@kobalte/solidbase/config/sidebar";

export default defineConfig({
	plugins: [
		solidBase.plugin({
			title: "Kobalte",
			description:
				"Unstyled components and primitives for building accessible web apps and design systems with SolidJS.",
			siteUrl: "https://kobalte.dev",
			llms: true,
			sitemap: true,
			robots: true,
			issueAutolink: "https://github.com/kobaltedev/kobalte/issues/:issue",
			lang: "en",
			markdown: {
				expressiveCode: {
					languageSwitcher: false,
				},
			},
			routes: {
				path: "/{version}/",
				version: {
					default: "v1",
					values: {
						v1: { path: "", label: `v${KBVersion}` },
					},
				},
			},
			editPath: "https://github.com/kobaltedev/kobalte/edit/main/docs/:path",
			themeConfig: {
				badges: {
					icons: {
						npm: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" viewBox="0 0 430 512"><path fill="currentColor" d="M71.609 112.569v286.649h143.432v-215.04h71.608v215.04h71.608V112.569zM430.08 40.96v430.08H0V40.96z"></path></svg>`,
						source: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28 43.52 0 87.04 5.76 128 17.28 97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0Z" clip-rule="evenodd"></path></svg>`,
					},
				},
				socialLinks: {
					github: "https://github.com/kobaltedev/kobalte",
					discord: "https://discord.com/invite/solidjs",
				},
				nav: [
					{
						text: "Components",
						link: "/docs/core",
					},
					{
						text: "Changelog",
						link: "/docs/changelog",
					},
				],
				sidebar: {
					"/docs/core": createFilesystemSidebar("./src/routes/docs/core"),
					"/docs/changelog": createFilesystemSidebar("./src/routes/docs/changelog"),
				},
			},
		}),
		solidStart(solidBase.startConfig()),
		nitro({
			preset: "netlify",
			prerender: { crawlLinks: true },
		}),
	],
	ssr: {
		noExternal: ["@docsearch/css"],
	},
});
