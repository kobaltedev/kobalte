import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/Separator",
	tags: ["autodocs"],
});

export default meta;

/** Horizontal separator (default) between two text blocks. */
export const Horizontal = meta.story({
	name: "Horizontal",
	render: () => (
		<div class="flex flex-col gap-3 font-sans text-sm text-slate-700 w-64">
			<p>Above the line</p>
			<Root class="border-t border-slate-200" />
			<p>Below the line</p>
		</div>
	),
});

/** Vertical separator between two inline items. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<div class="flex items-center gap-3 font-sans text-sm text-slate-700">
			<span>Home</span>
			<Root orientation="vertical" class="h-4 border-l border-slate-300" />
			<span>About</span>
			<Root orientation="vertical" class="h-4 border-l border-slate-300" />
			<span>Contact</span>
		</div>
	),
});

/** Separator rendered as a non-semantic `div` (for layout-only use). */
export const AsDiv = meta.story({
	name: "As Div",
	render: () => (
		<div class="flex flex-col gap-3 font-sans text-sm text-slate-700 w-64">
			<p>Section A</p>
			<Root as="div" class="h-px bg-slate-200" />
			<p>Section B</p>
		</div>
	),
});
