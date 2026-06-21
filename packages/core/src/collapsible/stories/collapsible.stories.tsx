import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Content,
	Root,
	Trigger,
} from "../index";

const meta = preview.meta({
	title: "Components/Collapsible",
	tags: ["autodocs"],
});

export default meta;

function Chevron() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="shrink-0 transition-transform duration-200 data-[expanded]:rotate-180"
		>
			<path d="M6 9l6 6 6-6" />
		</svg>
	);
}

const rootClass = "w-80 rounded-lg border border-slate-200 overflow-hidden font-sans";

const triggerClass =
	"flex w-full items-center justify-between bg-white px-4 py-3.5 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors data-[expanded]:text-blue-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 cursor-pointer";

const contentClass = "overflow-hidden bg-slate-50";

const contentTextClass = "px-4 py-3 text-sm text-slate-600 leading-relaxed m-0";

/** Basic expand/collapse panel. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass}>
			<Trigger class={triggerClass}>
				<span>What is Kobalte?</span>
				<Chevron />
			</Trigger>
			<Content class={contentClass}>
				<p class={contentTextClass}>
					Kobalte is a UI toolkit for building accessible web apps and design
					systems with SolidJS. It provides a set of low-level UI components and
					primitives which can be the foundation for your design system implementation.
				</p>
			</Content>
		</Root>
	),
});

/** `defaultOpen` pre-opens the panel on mount without controlling state. */
export const DefaultOpen = meta.story({
	name: "Default Open",
	render: () => (
		<Root defaultOpen class={rootClass}>
			<Trigger class={triggerClass}>
				<span>Open by default</span>
				<Chevron />
			</Trigger>
			<Content class={contentClass}>
				<p class={contentTextClass}>
					This panel was open on mount via the <code>defaultOpen</code> prop.
					It is still uncontrolled — clicking the trigger toggles it normally.
				</p>
			</Content>
		</Root>
	),
});

/** `disabled` prevents the trigger from toggling. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root disabled class={rootClass}>
			<Trigger class={triggerClass}>
				<span>Cannot be toggled</span>
				<Chevron />
			</Trigger>
			<Content class={contentClass}>
				<p class={contentTextClass}>This content is not reachable when disabled.</p>
			</Content>
		</Root>
	),
});

/**
 * Smooth expand/collapse using the CSS `grid-template-rows` trick.
 * `forceMount` keeps content in the DOM so the exit animation plays before unmount.
 * `data-[expanded]` / `data-[closed]` drive the transition.
 */
export const Animated = meta.story({
	name: "Animated",
	render: () => (
		<Root class={rootClass} forceMount>
			<Trigger class={triggerClass}>
				<span>Animated collapsible</span>
				<Chevron />
			</Trigger>
			<Content class="grid transition-[grid-template-rows] duration-300 ease-out data-[expanded]:grid-rows-[1fr] data-[closed]:grid-rows-[0fr] bg-slate-50">
				<div class="overflow-hidden">
					<p class={contentTextClass}>
						This content animates open and closed using a CSS{" "}
						<code>grid-template-rows</code> transition. The{" "}
						<code>--kb-collapsible-content-height</code> CSS variable is also
						available for custom animations.
					</p>
				</div>
			</Content>
		</Root>
	),
});

function ControlledDemo() {
	const [open, setOpen] = createSignal(false);
	return (
		<div class="flex flex-col gap-3 items-start font-sans">
			<Root open={open()} onOpenChange={setOpen} class={rootClass}>
				<Trigger class={triggerClass}>
					<span>Controlled panel</span>
					<Chevron />
				</Trigger>
				<Content class={contentClass}>
					<p class={contentTextClass}>
						State is controlled externally. The button below also toggles it.
					</p>
				</Content>
			</Root>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				class="rounded px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
			>
				{open() ? "Close" : "Open"} from outside
			</button>
		</div>
	);
}

/**
 * Pass `open` + `onOpenChange` for fully controlled state.
 * The button and the Controls panel both drive the open state.
 */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});
