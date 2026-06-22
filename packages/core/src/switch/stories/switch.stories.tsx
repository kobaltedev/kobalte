import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Control,
	Description,
	ErrorMessage,
	Input,
	Label,
	Root,
	Thumb,
} from "../index";

const meta = preview.meta({
	title: "Components/Switch",
	tags: ["autodocs"],
});

export default meta;


const rootClass = "flex items-center gap-3 font-sans";

const labelClass = "text-sm font-medium text-slate-700 select-none cursor-pointer";

const controlClass =
	"relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 data-[checked]:bg-blue-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[readonly]:cursor-not-allowed";

const thumbClass =
	"pointer-events-none inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 data-[checked]:translate-x-6";

const descriptionClass = "text-xs text-slate-500 mt-0.5";
const errorClass = "text-xs text-red-600 mt-0.5";

const wrapClass = "flex flex-col gap-0.5 font-sans";


/** A minimal switch with a label. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass}>
			<Control class={controlClass}>
				<Thumb class={thumbClass} />
				<Input />
			</Control>
			<Label class={labelClass}>Airplane mode</Label>
		</Root>
	),
});

/** `defaultChecked` pre-checks the switch without controlling state. */
export const DefaultChecked = meta.story({
	name: "Default Checked",
	render: () => (
		<Root class={rootClass} defaultChecked>
			<Control class={controlClass}>
				<Thumb class={thumbClass} />
				<Input />
			</Control>
			<Label class={labelClass}>Notifications</Label>
		</Root>
	),
});

/** A `Description` gives the user additional context below the label. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<div class={`${wrapClass}`}>
			<Root class={rootClass}>
				<Control class={controlClass}>
					<Thumb class={thumbClass} />
					<Input />
				</Control>
				<div class="flex flex-col">
					<Label class={labelClass}>Marketing emails</Label>
					<Description class={descriptionClass}>
						Receive emails about new products and features.
					</Description>
				</div>
			</Root>
		</div>
	),
});

/** `disabled` prevents interaction and dims the control. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class="flex flex-col gap-3">
			<Root class={rootClass} disabled>
				<Control class={controlClass}>
					<Thumb class={thumbClass} />
					<Input />
				</Control>
				<Label class={`${labelClass} opacity-50 cursor-not-allowed`}>
					Disabled (off)
				</Label>
			</Root>
			<Root class={rootClass} disabled defaultChecked>
				<Control class={controlClass}>
					<Thumb class={thumbClass} />
					<Input />
				</Control>
				<Label class={`${labelClass} opacity-50 cursor-not-allowed`}>
					Disabled (on)
				</Label>
			</Root>
		</div>
	),
});

/** `readOnly` shows the current value without allowing changes. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={rootClass} defaultChecked readOnly>
			<Control class={controlClass}>
				<Thumb class={thumbClass} />
				<Input />
			</Control>
			<Label class={`${labelClass} cursor-not-allowed`}>
				Dark mode (read only)
			</Label>
		</Root>
	),
});

function ControlledDemo() {
	const [checked, setChecked] = createSignal(false);
	return (
		<div class="flex flex-col gap-3 font-sans">
			<Root class={rootClass} checked={checked()} onChange={setChecked}>
				<Control class={controlClass}>
					<Thumb class={thumbClass} />
					<Input />
				</Control>
				<Label class={labelClass}>Dark mode</Label>
			</Root>
			<p class="text-xs text-slate-500">
				State: <strong>{checked() ? "on" : "off"}</strong>
			</p>
			<button
				type="button"
				class="self-start rounded px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
				onClick={() => setChecked(false)}
			>
				Reset
			</button>
		</div>
	);
}

/** `checked` + `onChange` give full external control over the toggle state. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

function ValidationDemo() {
	const [checked, setChecked] = createSignal(false);
	const isInvalid = () => !checked();
	return (
		<Root
			class={`${wrapClass}`}
			checked={checked()}
			onChange={setChecked}
			validationState={isInvalid() ? "invalid" : "valid"}
			required
		>
			<div class={rootClass}>
				<Control class={`${controlClass} data-[invalid]:ring-2 data-[invalid]:ring-red-500 data-[invalid]:ring-offset-2`}>
					<Thumb class={thumbClass} />
					<Input />
				</Control>
				<div class="flex flex-col">
					<Label class={labelClass}>
						Accept terms and conditions
					</Label>
					<Description class={descriptionClass}>
						You must accept to continue.
					</Description>
				</div>
			</div>
			<ErrorMessage class={errorClass}>
				You must accept the terms and conditions.
			</ErrorMessage>
		</Root>
	);
}

/** `validationState="invalid"` reveals the `ErrorMessage` and applies `data-invalid` to parts. */
export const WithValidation = meta.story({
	name: "With Validation",
	render: () => <ValidationDemo />,
});

function RenderPropDemo() {
	return (
		<Root class={rootClass}>
			{(state) => (
				<>
					<Control class={controlClass}>
						<Thumb class={thumbClass} />
						<Input />
					</Control>
					<Label class={labelClass}>
						{state.checked() ? "Enabled" : "Disabled"}
					</Label>
				</>
			)}
		</Root>
	);
}

/** The `children` render prop exposes internal state so you can derive UI from it. */
export const RenderProp = meta.story({
	name: "Render Prop",
	render: () => <RenderPropDemo />,
});

/** Multiple switches in a group, each independently toggled. */
export const SwitchGroup = meta.story({
	name: "Switch Group",
	render: () => (
		<div class="flex flex-col gap-3 font-sans w-72">
			<p class="text-sm font-semibold text-slate-800">Notification preferences</p>
			{(
				[
					{ label: "Comments", description: "When someone comments on your post." },
					{ label: "Mentions", description: "When you're mentioned in a thread." },
					{ label: "Reminders", description: "Daily digest of activity." },
				] as const
			).map((item) => (
				<Root class={rootClass} defaultChecked={item.label !== "Reminders"}>
					<Control class={controlClass}>
						<Thumb class={thumbClass} />
						<Input />
					</Control>
					<div class="flex flex-col">
						<Label class={labelClass}>{item.label}</Label>
						<Description class={descriptionClass}>{item.description}</Description>
					</div>
				</Root>
			))}
		</div>
	),
});
