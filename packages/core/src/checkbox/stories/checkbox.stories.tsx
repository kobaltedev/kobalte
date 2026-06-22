import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Control,
	Description,
	ErrorMessage,
	Indicator,
	Input,
	Label,
	Root,
} from "../index";

const meta = preview.meta({
	title: "Components/Checkbox",
	tags: ["autodocs"],
});

export default meta;


const rootClass = "flex items-center gap-3 font-sans";

const controlClass =
	"relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 border-slate-300 bg-white transition-colors duration-150 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 data-[checked]:border-blue-500 data-[checked]:bg-blue-500 data-[indeterminate]:border-blue-500 data-[indeterminate]:bg-blue-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

const labelClass =
	"text-sm font-medium text-slate-700 select-none cursor-pointer";

const descriptionClass = "text-xs text-slate-500 mt-0.5";
const errorClass = "text-xs text-red-600 mt-0.5";


function CheckIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="text-white"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	);
}

function DashIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			aria-hidden="true"
			class="text-white"
		>
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	);
}


/** A minimal checkbox with a label. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass}>
			<Control class={controlClass}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<Label class={labelClass}>Accept terms</Label>
		</Root>
	),
});

/** `defaultChecked` pre-checks the box without controlling state. */
export const DefaultChecked = meta.story({
	name: "Default Checked",
	render: () => (
		<Root class={rootClass} defaultChecked>
			<Control class={controlClass}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<Label class={labelClass}>Receive newsletter</Label>
		</Root>
	),
});

/** `indeterminate` renders the dash state regardless of checked. */
export const Indeterminate = meta.story({
	name: "Indeterminate",
	render: () => (
		<div class="flex flex-col gap-3">
			<Root class={rootClass} indeterminate>
				<Control class={controlClass}>
					<Indicator>
						<DashIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={labelClass}>Select all (partial)</Label>
			</Root>
			<Root class={rootClass} indeterminate defaultChecked>
				<Control class={controlClass}>
					<Indicator>
						<DashIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={labelClass}>Select all (partial + checked)</Label>
			</Root>
		</div>
	),
});

/** A `Description` adds context below the label. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<Root class={rootClass}>
			<Control class={controlClass}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<div class="flex flex-col">
				<Label class={labelClass}>Marketing emails</Label>
				<Description class={descriptionClass}>
					Receive emails about new products and features.
				</Description>
			</div>
		</Root>
	),
});

/** `disabled` prevents interaction and dims the control. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<div class="flex flex-col gap-3">
			<Root class={rootClass} disabled>
				<Control class={controlClass}>
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={`${labelClass} opacity-50 cursor-not-allowed`}>
					Disabled (unchecked)
				</Label>
			</Root>
			<Root class={rootClass} disabled defaultChecked>
				<Control class={controlClass}>
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={`${labelClass} opacity-50 cursor-not-allowed`}>
					Disabled (checked)
				</Label>
			</Root>
		</div>
	),
});

/** `readOnly` shows the current state without allowing changes. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={rootClass} defaultChecked readOnly>
			<Control class={controlClass}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<Label class={`${labelClass} cursor-not-allowed`}>
				Agreed to terms (read only)
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
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={labelClass}>Remember me</Label>
			</Root>
			<p class="text-xs text-slate-500">
				State: <strong>{checked() ? "checked" : "unchecked"}</strong>
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

/** `checked` + `onChange` give full external control. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => <ControlledDemo />,
});

function ValidationDemo() {
	const [checked, setChecked] = createSignal(false);
	return (
		<Root
			class="flex flex-col gap-0.5 font-sans"
			checked={checked()}
			onChange={setChecked}
			validationState={checked() ? "valid" : "invalid"}
			required
		>
			<div class={rootClass}>
				<Control
					class={`${controlClass} data-[invalid]:border-red-500 data-[invalid]:ring-red-500`}
				>
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<div class="flex flex-col">
					<Label class={labelClass}>Accept terms and conditions</Label>
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
						<Indicator>
							{state.indeterminate() ? <DashIcon /> : <CheckIcon />}
						</Indicator>
						<Input />
					</Control>
					<Label class={labelClass}>
						{state.checked()
							? "Checked"
							: state.indeterminate()
								? "Indeterminate"
								: "Unchecked"}
					</Label>
				</>
			)}
		</Root>
	);
}

/** The `children` render prop exposes internal state to derive UI from. */
export const RenderProp = meta.story({
	name: "Render Prop",
	render: () => <RenderPropDemo />,
});

function SelectAllDemo() {
	const items = ["Comments", "Mentions", "Follows", "Reminders"] as const;
	const [checked, setChecked] = createSignal<Set<string>>(
		new Set(["Comments", "Mentions"]),
	);

	const allChecked = () => checked().size === items.length;
	const someChecked = () => checked().size > 0 && !allChecked();

	const toggleAll = (on: boolean) => {
		setChecked(on ? new Set<string>(items) : new Set<string>());
	};

	const toggle = (item: string) => {
		setChecked((prev) => {
			const next = new Set(prev);
			next.has(item) ? next.delete(item) : next.add(item);
			return next;
		});
	};

	return (
		<div class="flex flex-col gap-3 font-sans w-64">
			<Root
				class={rootClass}
				checked={allChecked()}
				indeterminate={someChecked()}
				onChange={toggleAll}
			>
				<Control class={controlClass}>
					<Indicator>
						{someChecked() ? <DashIcon /> : <CheckIcon />}
					</Indicator>
					<Input />
				</Control>
				<Label class={`${labelClass} font-semibold`}>Notifications</Label>
			</Root>
			<div class="ml-8 flex flex-col gap-2 border-l border-slate-200 pl-4">
				{items.map((item) => (
					<Root
						class={rootClass}
						checked={checked().has(item)}
						onChange={() => toggle(item)}
					>
						<Control class={controlClass}>
							<Indicator>
								<CheckIcon />
							</Indicator>
							<Input />
						</Control>
						<Label class={labelClass}>{item}</Label>
					</Root>
				))}
			</div>
		</div>
	);
}

/** A parent "select all" checkbox with indeterminate state drives a group of children. */
export const SelectAll = meta.story({
	name: "Select All",
	render: () => <SelectAllDemo />,
});
