import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/Badge",
	tags: ["autodocs"],
});

export default meta;


const baseClass =
	"inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold";


/** A basic badge with text content. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={`${baseClass} bg-slate-100 text-slate-700`}>Default</Root>
	),
});

/** Common semantic variants using background/text colour. */
export const Variants = meta.story({
	name: "Variants",
	render: () => (
		<div class="flex flex-wrap gap-3 font-sans">
			<Root class={`${baseClass} bg-slate-100 text-slate-700`}>Default</Root>
			<Root class={`${baseClass} bg-blue-100 text-blue-700`}>Info</Root>
			<Root class={`${baseClass} bg-green-100 text-green-700`}>Success</Root>
			<Root class={`${baseClass} bg-yellow-100 text-yellow-700`}>Warning</Root>
			<Root class={`${baseClass} bg-red-100 text-red-700`}>Error</Root>
		</div>
	),
});

/** Solid-fill style badges. */
export const Solid = meta.story({
	name: "Solid",
	render: () => (
		<div class="flex flex-wrap gap-3 font-sans">
			<Root class={`${baseClass} bg-slate-600 text-white`}>Default</Root>
			<Root class={`${baseClass} bg-blue-600 text-white`}>Info</Root>
			<Root class={`${baseClass} bg-green-600 text-white`}>Success</Root>
			<Root class={`${baseClass} bg-yellow-500 text-white`}>Warning</Root>
			<Root class={`${baseClass} bg-red-600 text-white`}>Error</Root>
		</div>
	),
});

/** `textValue` sets `aria-label` for badges whose content is not descriptive text (e.g. a count). */
export const WithTextValue = meta.story({
	name: "With Text Value",
	render: () => (
		<div class="flex flex-wrap gap-3 font-sans items-center">
			<span class="text-sm text-slate-600">Notifications</span>
			<Root
				class={`${baseClass} bg-red-600 text-white min-w-[1.25rem]`}
				textValue="3 unread notifications"
			>
				3
			</Root>
		</div>
	),
});

/** Badges next to other UI elements. */
export const InContext = meta.story({
	name: "In Context",
	render: () => (
		<div class="flex flex-col gap-4 font-sans w-64">
			<div class="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
				<span class="text-sm font-medium text-slate-700">Inbox</span>
				<Root
					class={`${baseClass} bg-blue-600 text-white`}
					textValue="12 unread messages"
				>
					12
				</Root>
			</div>
			<div class="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
				<span class="text-sm font-medium text-slate-700">Drafts</span>
				<Root class={`${baseClass} bg-slate-100 text-slate-600`}>4</Root>
			</div>
			<div class="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
				<span class="text-sm font-medium text-slate-700">Sent</span>
				<Root class={`${baseClass} bg-green-100 text-green-700`}>Done</Root>
			</div>
		</div>
	),
});
