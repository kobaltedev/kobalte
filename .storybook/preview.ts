import * as docsAnnotations from "@storybook/addon-docs/preview";
import { definePreview } from "storybook-solidjs-vite/next";
import "./globals.css";

export default definePreview({
	addons: [docsAnnotations],
	parameters: { layout: "centered", docs: { toc: true } },
});
