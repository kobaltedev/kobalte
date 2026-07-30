import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Badge",
	tags: ["autodocs"],
});

export default meta;

/** A basic badge with text content. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={[style.badge__base, style.badge__default]}>Default</Root>
	),
});

/** Common semantic variants using background/text colour. */
export const Variants = meta.story({
	name: "Variants",
	render: () => (
		<div class={style.badge__variants}>
			<Root class={[style.badge__base, style.badge__default]}>Default</Root>
			<Root class={[style.badge__base, style.badge__info]}>Info</Root>
			<Root class={[style.badge__base, style.badge__success]}>Success</Root>
			<Root class={[style.badge__base, style.badge__warning]}>Warning</Root>
			<Root class={[style.badge__base, style.badge__error]}>Error</Root>
		</div>
	),
});

/** Solid-fill style badges. */
export const Solid = meta.story({
	name: "Solid",
	render: () => (
		<div class={style.badge__variants}>
			<Root class={[style.badge__base, style["badge__solid-default"]]}>
				Default
			</Root>
			<Root class={[style.badge__base, style["badge__solid-info"]]}>Info</Root>
			<Root class={[style.badge__base, style["badge__solid-success"]]}>
				Success
			</Root>
			<Root class={[style.badge__base, style["badge__solid-warning"]]}>
				Warning
			</Root>
			<Root class={[style.badge__base, style["badge__solid-error"]]}>
				Error
			</Root>
		</div>
	),
});

/** `textValue` sets `aria-label` for badges whose content is not descriptive text (e.g. a count). */
export const WithTextValue = meta.story({
	name: "With Text Value",
	render: () => (
		<div class={style["badge__text-value"]}>
			<span class={style["badge__text-sm"]}>Notifications</span>
			<Root
				class={[
					style.badge__base,
					style.badge__error,
					style["badge__min-width"],
				]}
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
		<div class={style["badge__in-context"]}>
			<div class={style.badge__card}>
				<span class={style["badge__card-label"]}>Inbox</span>
				<Root
					class={[style.badge__base, style["badge__solid-info"]]}
					textValue="12 unread messages"
				>
					12
				</Root>
			</div>
			<div class={style.badge__card}>
				<span class={style["badge__card-label"]}>Drafts</span>
				<Root class={[style.badge__base, style.badge__default]}>4</Root>
			</div>
			<div class={style.badge__card}>
				<span class={style["badge__card-label"]}>Sent</span>
				<Root class={[style.badge__base, style.badge__success]}>Done</Root>
			</div>
		</div>
	),
});
