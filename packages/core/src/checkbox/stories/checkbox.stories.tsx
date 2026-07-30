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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Checkbox",
	tags: ["autodocs"],
});

export default meta;

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
			class={style.icon}
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
			class={style.icon}
		>
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	);
}

/** A minimal checkbox with a label. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.root}>
			<Control class={style.control}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<Label class={style.label}>Accept terms</Label>
		</Root>
	),
});

/** `defaultChecked` pre-checks the box without controlling state. */
export const DefaultChecked = meta.story({
	name: "Default Checked",
	render: () => (
		<Root class={style.root} defaultChecked>
			<Control class={style.control}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<Label class={style.label}>Receive newsletter</Label>
		</Root>
	),
});

/** `indeterminate` renders the dash state regardless of checked. */
export const Indeterminate = meta.story({
	name: "Indeterminate",
	render: () => (
		<div class={style.column}>
			<Root class={style.root} indeterminate>
				<Control class={style.control}>
					<Indicator>
						<DashIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={style.label}>Select all (partial)</Label>
			</Root>
			<Root class={style.root} indeterminate defaultChecked>
				<Control class={style.control}>
					<Indicator>
						<DashIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={style.label}>Select all (partial + checked)</Label>
			</Root>
		</div>
	),
});

/** A `Description` adds context below the label. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<Root class={style.root}>
			<Control class={style.control}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<div class={style.textColumn}>
				<Label class={style.label}>Marketing emails</Label>
				<Description class={style.description}>
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
		<div class={style.column}>
			<Root class={style.root} disabled>
				<Control class={style.control}>
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={[style.label, style.labelDisabled]}>
					Disabled (unchecked)
				</Label>
			</Root>
			<Root class={style.root} disabled defaultChecked>
				<Control class={style.control}>
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={[style.label, style.labelDisabled]}>
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
		<Root class={style.root} defaultChecked readOnly>
			<Control class={style.control}>
				<Indicator>
					<CheckIcon />
				</Indicator>
				<Input />
			</Control>
			<Label class={[style.label, style.labelReadOnly]}>
				Agreed to terms (read only)
			</Label>
		</Root>
	),
});

function ControlledDemo() {
	const [checked, setChecked] = createSignal(false);
	return (
		<div class={[style.column, style.selectParent]}>
			<Root class={style.root} checked={checked()} onChange={setChecked}>
				<Control class={style.control}>
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<Label class={style.label}>Remember me</Label>
			</Root>
			<p class={style.stateText}>
				State: <strong>{checked() ? "checked" : "unchecked"}</strong>
			</p>
			<button
				type="button"
				class={style.resetButton}
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
			class={[style.columnGap05, style.selectParent]}
			checked={checked()}
			onChange={setChecked}
			validationState={checked() ? "valid" : "invalid"}
			required
		>
			<div class={style.root}>
				<Control class={[style.control, style.controlInvalid]}>
					<Indicator>
						<CheckIcon />
					</Indicator>
					<Input />
				</Control>
				<div class={style.textColumn}>
					<Label class={style.label}>Accept terms and conditions</Label>
					<Description class={style.description}>
						You must accept to continue.
					</Description>
				</div>
			</div>
			<ErrorMessage class={style.error}>
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
		<Root class={style.root}>
			{(state) => (
				<>
					<Control class={style.control}>
						<Indicator>
							{state.indeterminate() ? <DashIcon /> : <CheckIcon />}
						</Indicator>
						<Input />
					</Control>
					<Label class={style.label}>
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
		<div class={[style.selectParent, style.selectChildren]}>
			<Root
				class={style.root}
				checked={allChecked()}
				indeterminate={someChecked()}
				onChange={toggleAll}
			>
				<Control class={style.control}>
					<Indicator>{someChecked() ? <DashIcon /> : <CheckIcon />}</Indicator>
					<Input />
				</Control>
				<Label class={[style.label, style.fontSemibold]}>Notifications</Label>
			</Root>
			<div class={style.selectChildren}>
				{items.map((item) => (
					<Root
						class={style.root}
						checked={checked().has(item)}
						onChange={() => toggle(item)}
					>
						<Control class={style.control}>
							<Indicator>
								<CheckIcon />
							</Indicator>
							<Input />
						</Control>
						<Label class={style.label}>{item}</Label>
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
