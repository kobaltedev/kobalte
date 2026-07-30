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
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/Switch",
	tags: ["autodocs"],
});

export default meta;

/** A minimal switch with a label. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.root}>
			<Control class={style.control}>
				<Thumb class={style.thumb} />
				<Input />
			</Control>
			<Label class={style.label}>Airplane mode</Label>
		</Root>
	),
});

/** `defaultChecked` pre-checks the switch without controlling state. */
export const DefaultChecked = meta.story({
	name: "Default Checked",
	render: () => (
		<Root class={style.root} defaultChecked>
			<Control class={style.control}>
				<Thumb class={style.thumb} />
				<Input />
			</Control>
			<Label class={style.label}>Notifications</Label>
		</Root>
	),
});

/** A `Description` gives the user additional context below the label. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<div class={style.wrap}>
			<Root class={style.root}>
				<Control class={style.control}>
					<Thumb class={style.thumb} />
					<Input />
				</Control>
				<div class={style.textColumn}>
					<Label class={style.label}>Marketing emails</Label>
					<Description class={style.description}>
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
		<div class={style.column}>
			<Root class={style.root} disabled>
				<Control class={style.control}>
					<Thumb class={style.thumb} />
					<Input />
				</Control>
				<Label class={[style.label, style.labelDisabled]}>Disabled (off)</Label>
			</Root>
			<Root class={style.root} disabled defaultChecked>
				<Control class={style.control}>
					<Thumb class={style.thumb} />
					<Input />
				</Control>
				<Label class={[style.label, style.labelDisabled]}>Disabled (on)</Label>
			</Root>
		</div>
	),
});

/** `readOnly` shows the current value without allowing changes. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={style.root} defaultChecked readOnly>
			<Control class={style.control}>
				<Thumb class={style.thumb} />
				<Input />
			</Control>
			<Label class={[style.label, style.labelReadOnly]}>
				Dark mode (read only)
			</Label>
		</Root>
	),
});

function ControlledDemo() {
	const [checked, setChecked] = createSignal(false);
	return (
		<div class={[style.controlledWrapper, style.root]}>
			<Root class={style.root} checked={checked()} onChange={setChecked}>
				<Control class={style.control}>
					<Thumb class={style.thumb} />
					<Input />
				</Control>
				<Label class={style.label}>Dark mode</Label>
			</Root>
			<p class={style.stateText}>
				State: <strong>{checked() ? "on" : "off"}</strong>
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
			class={style.wrap}
			checked={checked()}
			onChange={setChecked}
			validationState={isInvalid() ? "invalid" : "valid"}
			required
		>
			<div class={style.root}>
				<Control class={[style.control, style.controlInvalid]}>
					<Thumb class={style.thumb} />
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
						<Thumb class={style.thumb} />
						<Input />
					</Control>
					<Label class={style.label}>
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
		<div class={[style.column, style.groupParent]}>
			<p class={style.groupTitle}>Notification preferences</p>
			{(
				[
					{
						label: "Comments",
						description: "When someone comments on your post.",
					},
					{
						label: "Mentions",
						description: "When you're mentioned in a thread.",
					},
					{ label: "Reminders", description: "Daily digest of activity." },
				] as const
			).map((item) => (
				<Root class={style.root} defaultChecked={item.label !== "Reminders"}>
					<Control class={style.control}>
						<Thumb class={style.thumb} />
						<Input />
					</Control>
					<div class={style.textColumn}>
						<Label class={style.label}>{item.label}</Label>
						<Description class={style.description}>
							{item.description}
						</Description>
					</div>
				</Root>
			))}
		</div>
	),
});
