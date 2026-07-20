import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Separator",
	tags: ["autodocs"],
});

export default meta;

/** Horizontal separator (default) between two text blocks. */
export const Horizontal = meta.story({
	name: "Horizontal",
	render: () => (
		<div class={style.separator__col}>
			<p>Above the line</p>
			<Root class={style.separator__horizontal} />
			<p>Below the line</p>
		</div>
	),
});

/** Vertical separator between two inline items. */
export const Vertical = meta.story({
	name: "Vertical",
	render: () => (
		<div class={style.separator__row}>
			<span>Home</span>
			<Root orientation="vertical" class={style.separator__vertical} />
			<span>About</span>
			<Root orientation="vertical" class={style.separator__vertical} />
			<span>Contact</span>
		</div>
	),
});

/** Separator rendered as a non-semantic `div` (for layout-only use). */
export const AsDiv = meta.story({
	name: "As Div",
	render: () => (
		<div class={style.separator__col}>
			<p>Section A</p>
			<Root as="div" class={style["separator__as-div"]} />
			<p>Section B</p>
		</div>
	),
});
