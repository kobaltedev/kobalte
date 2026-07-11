import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/Divider",
	tags: ["autodocs"],
});

export default meta;

/** Horizontal divider (default) between two text blocks. */
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

/** Vertical divider between two inline items. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<div class="flex items-center h-4 gap-3 font-sans text-sm text-slate-700">
			<span>Home</span>
			<Root
				orientation="vertical"
				class="self-stretch border-l border-slate-300"
			/>
			<span>About</span>
			<Root
				orientation="vertical"
				class="self-stretch border-l border-slate-300"
			/>
			<span>Contact</span>
		</div>
	),
});

/**
 * A divider can wrap content (text or an icon) rendered in the middle of
 * the line. This is a pure CSS technique: the root becomes a flex
 * container and `::before`/`::after` draw the lines on either side.
 */
export const WithText = meta.story({
	name: "With Text",
	render: () => (
		<div class="flex flex-col gap-3 font-sans text-sm text-slate-700 w-64">
			<p>Sign in with your email</p>
			<Root class="flex items-center text-xs text-slate-400 before:content-[''] before:flex-1 before:border-t before:border-slate-200 before:mr-3 after:content-[''] after:flex-1 after:border-t after:border-slate-200 after:ml-3">
				OR
			</Root>
			<p>Continue as guest</p>
		</div>
	),
});

/** A vertical divider with an icon centered on the line. */
export const WithIcon = meta.story({
	name: "With Icon",
	render: () => (
		<div class="flex items-center h-16 gap-0 font-sans text-sm text-slate-700">
			<div class="w-24 text-center">Panel A</div>
			<Root
				orientation="vertical"
				class="flex flex-col items-center self-stretch text-slate-400 before:content-[''] before:flex-1 before:border-l before:border-slate-300 before:mb-2 after:content-[''] after:flex-1 after:border-l after:border-slate-300 after:mt-2"
			>
				＋
			</Root>
			<div class="w-24 text-center">Panel B</div>
		</div>
	),
});

/**
 * `inset` is exposed as a `data-inset` attribute so consuming CSS can
 * shrink or stretch the line to align with surrounding content (e.g. to
 * match a `List`'s padding, similar to Joy UI's `inset="context"`).
 */
export const Inset = meta.story({
	name: "Inset",
	render: () => (
		<ul class="flex flex-col w-64 font-sans text-sm text-slate-700 p-0 m-0 list-none">
			<li class="px-4 py-2">Profile</li>
			<Root
				class="border-t border-slate-200 data-[inset=context]:ml-4"
				inset="context"
			/>
			<li class="px-4 py-2">Settings</li>
			<Root class="border-t border-slate-200" />
			<li class="px-4 py-2">Log out</li>
		</ul>
	),
});

/** Divider rendered as a semantic `hr` (no `role` override needed). */
export const AsHr = meta.story({
	name: "As Hr",
	render: () => (
		<div class="flex flex-col gap-3 font-sans text-sm text-slate-700 w-64">
			<p>Section A</p>
			<Root as="hr" class="border-t border-slate-200 m-0" />
			<p>Section B</p>
		</div>
	),
});
