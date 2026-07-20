import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Link",
	tags: ["autodocs"],
});

export default meta;

/** A standard anchor link. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.link__base} href="https://kobalte.dev">
			Kobalte docs
		</Root>
	),
});

/** Opens in a new tab. */
export const ExternalLink = meta.story({
	name: "External Link",
	render: () => (
		<Root
			class={style.link__base}
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
		<Root class={style.link__disabled} href="https://kobalte.dev" disabled>
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
			class={`${style.link__base} ${style.link__as - button}`}
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
		<p class={style.link__prose}>
			Kobalte is a UI toolkit for building accessible web applications with{" "}
			<Root class={style.link__base} href="https://www.solidjs.com">
				SolidJS
			</Root>
			. It provides a collection of low-level, unstyled components and
			primitives. Learn more on the{" "}
			<Root class={style.link__base} href="https://kobalte.dev">
				Kobalte website
			</Root>
			.
		</p>
	),
});
