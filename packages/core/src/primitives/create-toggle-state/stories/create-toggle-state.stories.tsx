import { createSignal } from "solid-js";
import preview from "../../../../../../.storybook/preview.js";
import { createToggleState } from "../index";

const meta = preview.meta({
	title: "Primitives/createToggleState",
	tags: ["autodocs"],
});

export default meta;

function ToggleButton(props: {
	label: string;
	isSelected?: boolean;
	defaultIsSelected?: boolean;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	onSelectedChange?: (v: boolean) => void;
}) {
	const state = createToggleState({
		isSelected: () => props.isSelected,
		defaultIsSelected: () => props.defaultIsSelected,
		isDisabled: () => props.isDisabled,
		isReadOnly: () => props.isReadOnly,
		onSelectedChange: props.onSelectedChange,
	});

	return (
		<button
			type="button"
			aria-pressed={state.isSelected()}
			onClick={state.toggle}
			disabled={props.isDisabled}
			class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium font-sans transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
			classList={{
				"border-blue-500 bg-blue-50 text-blue-700": state.isSelected(),
				"border-slate-200 bg-white text-slate-700 hover:bg-slate-50": !state.isSelected(),
				"opacity-50 cursor-not-allowed": !!props.isDisabled,
				"cursor-default": !!props.isReadOnly,
			}}
		>
			{props.label}
			<span class="text-xs opacity-60">{state.isSelected() ? "on" : "off"}</span>
		</button>
	);
}

/** Basic toggle — click to flip between selected and unselected. */
export const Default = meta.story({
	name: "Default",
	render: () => <ToggleButton label="Bold" />,
});

/** `defaultIsSelected` starts the toggle in the selected state. */
export const DefaultSelected = meta.story({
	name: "Default Selected",
	render: () => <ToggleButton label="Bold" defaultIsSelected />,
});

/** `isDisabled` prevents toggling and exposes the disabled state for styling. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class="flex gap-2">
			<ToggleButton label="Bold (off, disabled)" isDisabled />
			<ToggleButton label="Italic (on, disabled)" defaultIsSelected isDisabled />
		</div>
	),
});

/** `isReadOnly` allows reading the state but blocks user changes. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<div class="flex gap-2">
			<ToggleButton label="Read-only off" isReadOnly />
			<ToggleButton label="Read-only on" defaultIsSelected isReadOnly />
		</div>
	),
});

/** `isSelected` + `onSelectedChange` give full external control. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const [selected, setSelected] = createSignal(false);
		return (
			<div class="flex flex-col gap-3 font-sans">
				<ToggleButton
					label="Bold"
					isSelected={selected()}
					onSelectedChange={setSelected}
				/>
				<div class="flex gap-2">
					<button
						class="rounded px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200"
						onClick={() => setSelected(true)}
					>
						Select
					</button>
					<button
						class="rounded px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200"
						onClick={() => setSelected(false)}
					>
						Deselect
					</button>
				</div>
				<p class="text-xs text-slate-500">
					External signal: <strong>{selected() ? "on" : "off"}</strong>
				</p>
			</div>
		);
	},
});

/** Multiple independent toggle states — each instance is self-contained. */
export const Toolbar = meta.story({
	name: "Toolbar",
	render: () => {
		const tools = ["Bold", "Italic", "Underline", "Strikethrough"].map((label) => ({
			label,
			state: createToggleState(),
		}));
		return (
			<div class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 font-sans">
				{tools.map(({ label, state }) => (
					<button
						type="button"
						aria-pressed={state.isSelected()}
						onClick={state.toggle}
						class="rounded px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
						classList={{
							"bg-blue-50 text-blue-700": state.isSelected(),
							"text-slate-600 hover:bg-slate-100": !state.isSelected(),
						}}
					>
						{label}
					</button>
				))}
			</div>
		);
	},
});
