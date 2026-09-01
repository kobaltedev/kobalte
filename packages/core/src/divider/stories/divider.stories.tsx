import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Divider",
	tags: ["autodocs"],
});

export default meta;

/** Horizontal divider (default) between two text blocks. */
export const Horizontal = meta.story({
	name: "Horizontal",
	render: () => (
		<div class={style.wrapper}>
			<p>Above the line</p>
			<Root class={style.horizontalDivider} />
			<p>Below the line</p>
		</div>
	),
});

/** Vertical divider between two inline items. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<div class={style.verticalWrapper}>
			<span>Home</span>
			<Root orientation="vertical" class={style.verticalDivider} />
			<span>About</span>
			<Root orientation="vertical" class={style.verticalDivider} />
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
		<div class={style.wrapper}>
			<p>Sign in with your email</p>
			<Root class={style.withTextRoot}>OR</Root>
			<p>Continue as guest</p>
		</div>
	),
});

/** A vertical divider with an icon centered on the line. */
export const WithIcon = meta.story({
	name: "With Icon",
	render: () => (
		<div class={style.iconWrapper}>
			<div class={style.panel}>Panel A</div>
			<Root orientation="vertical" class={style.iconDivider}>
				＋
			</Root>
			<div class={style.panel}>Panel B</div>
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
		<ul class={style.insetList}>
			<li class={style.insetItem}>Profile</li>
			<Root class={style.insetDivider} inset="context" />
			<li class={style.insetItem}>Settings</li>
			<Root class={style.insetDivider} />
			<li class={style.insetItem}>Log out</li>
		</ul>
	),
});

/** Divider rendered as a semantic `hr` (no `role` override needed). */
export const AsHr = meta.story({
	name: "As Hr",
	render: () => (
		<div class={style.wrapper}>
			<p>Section A</p>
			<Root as="hr" class={style.hrDivider} />
			<p>Section B</p>
		</div>
	),
});
