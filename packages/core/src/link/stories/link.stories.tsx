import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/Link",
	tags: ["autodocs"],
});

export default meta;

// ── Shared styles ──────────────────────────────────────────────────────────

const baseClass =
	"font-sans text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-sm";

const disabledClass =
	"font-sans text-sm text-slate-400 underline underline-offset-2 cursor-not-allowed data-[disabled]:pointer-events-none";

// ── Stories ────────────────────────────────────────────────────────────────

/** A standard anchor link. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={baseClass} href="https://kobalte.dev">
			Kobalte docs
		</Root>
	),
});

/** Opens in a new tab. */
export const ExternalLink = meta.story({
	name: "External Link",
	render: () => (
		<Root
			class={baseClass}
			href="https://kobalte.dev"
			target="_blank"
			rel="noopener noreferrer"
		>
			Open in new tab ↗
		</Root>
	),
});

/** `disabled` removes the href, sets `aria-disabled`, and renders `role="link"`. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={disabledClass} href="https://kobalte.dev" disabled>
			Disabled link
		</Root>
	),
});

/** Rendered as a `<button>` via `as` — useful for SPA navigation callbacks. */
export const AsButton = meta.story({
	name: "As Button",
	render: () => (
		<Root
			as="button"
			class={`${baseClass} bg-transparent border-0 p-0 cursor-pointer`}
			onClick={() => alert("navigate!")}
		>
			Navigate (button)
		</Root>
	),
});

/** Links in a block of prose. */
export const InProse = meta.story({
	name: "In Prose",
	render: () => (
		<p class="font-sans text-sm text-slate-700 max-w-xs leading-relaxed">
			Kobalte is a UI toolkit for building accessible web applications with{" "}
			<Root class={baseClass} href="https://www.solidjs.com">
				SolidJS
			</Root>
			. It provides a collection of low-level, unstyled components and
			primitives. Learn more on the{" "}
			<Root class={baseClass} href="https://kobalte.dev">
				Kobalte website
			</Root>
			.
		</p>
	),
});
