import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import { Root } from "../index";

const meta = preview.meta({
	title: "Components/ToggleButton",
	tags: ["autodocs"],
});

export default meta;

const btnClass =
	"inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 data-[pressed]:bg-slate-900 data-[pressed]:text-white data-[pressed]:border-slate-900 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";

/** A basic toggle that flips between pressed and unpressed. */
export const Default = meta.story({
	name: "Default",
	render: () => <Root class={btnClass}>Bold</Root>,
});

/** `defaultPressed` starts the button in the pressed state. */
export const DefaultPressed = meta.story({
	name: "Default Pressed",
	render: () => (
		<Root class={btnClass} defaultPressed>
			Italic
		</Root>
	),
});

/** `disabled` prevents toggling. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class="flex gap-2 font-sans">
			<Root class={btnClass} disabled>
				Off
			</Root>
			<Root class={btnClass} disabled defaultPressed>
				On
			</Root>
		</div>
	),
});

/** Controlled via `pressed` + `onChange`. */
function ControlledDemo() {
	const [pressed, setPressed] = createSignal(false);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root class={btnClass} pressed={pressed()} onChange={setPressed}>
				{(state) => (state.pressed() ? "Muted" : "Unmuted")}
			</Root>
			<p class="text-xs text-slate-500">
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
		<Root class={btnClass}>
			{(state) => (
				<span class="flex items-center gap-1.5">
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
		<div class="inline-flex gap-1 rounded-lg border border-slate-200 bg-white p-1 font-sans">
			{(["B", "I", "U"] as const).map((label) => (
				<Root
					class="inline-flex h-8 w-8 items-center justify-center rounded text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-[pressed]:bg-slate-900 data-[pressed]:text-white"
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
