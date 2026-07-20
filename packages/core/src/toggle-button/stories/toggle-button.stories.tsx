import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/ToggleButton",
	tags: ["autodocs"],
});

export default meta;

/** A basic toggle that flips between pressed and unpressed. */
export const Default = meta.story({
	name: "Default",
	render: () => <Root class={style["toggle-button__root"]}>Bold</Root>,
});

/** `defaultPressed` starts the button in the pressed state. */
export const DefaultPressed = meta.story({
	name: "Default Pressed",
	render: () => (
		<Root class={style["toggle-button__root"]} defaultPressed>
			Italic
		</Root>
	),
});

/** `disabled` prevents toggling. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class={style["toggle-button__demo"]}>
			<Root class={style["toggle-button__root"]} disabled>
				Off
			</Root>
			<Root class={style["toggle-button__root"]} disabled defaultPressed>
				On
			</Root>
		</div>
	),
});

/** Controlled via `pressed` + `onChange`. */
function ControlledDemo() {
	const [pressed, setPressed] = createSignal(false);
	return (
		<div class={style["toggle-button__wrapper"]}>
			<Root
				class={style["toggle-button__root"]}
				pressed={pressed()}
				onChange={setPressed}
			>
				{(state) => (state.pressed() ? "Muted" : "Unmuted")}
			</Root>
			<p class={style["toggle-button__text"]}>
				State: <strong>{pressed() ? "pressed" : "unpressed"}</strong>
			</p>
		</div>
	);
}

export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

/** Render prop exposes `pressed` state to derive label or icon. */
export const RenderProp = meta.story({
	name: "Render Prop",
	render: () => (
		<Root class={style["toggle-button__root"]}>
			{(state) => (
				<span class={style["toggle-button__span"]}>
					<span>{state.pressed() ? "★" : "☆"}</span>
					<span>{state.pressed() ? "Starred" : "Star"}</span>
				</span>
			)}
		</Root>
	),
});

/** A toolbar of icon-style toggles. */
export const Toolbar = meta.story({
	name: "Toolbar",
	render: () => (
		<div class={style["toggle-button__toolbar"]}>
			{(["B", "I", "U"] as const).map((label) => (
				<Root
					class={style["toggle-button__toolbarItem"]}
					aria-label={
						label === "B" ? "Bold" : label === "I" ? "Italic" : "Underline"
					}
				>
					{label}
				</Root>
			))}
		</div>
	),
});
