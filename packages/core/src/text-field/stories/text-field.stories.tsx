import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Input,
	Label,
	Root,
	TextArea,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/TextField",
	tags: ["autodocs"],
});

export default meta;

/** Basic text input with a label. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={style.root}>
			<Label class={style.label}>Favorite fruit</Label>
			<Input class={style.input} placeholder="e.g. Apple" />
		</Root>
	),
});

/** Pre-populated via `defaultValue` — uncontrolled. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={style.root} defaultValue="Apple">
			<Label class={style.label}>Favorite fruit</Label>
			<Input class={style.input} />
		</Root>
	),
});

/** Description provides supplementary hint text below the input. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<Root class={style.root}>
			<Label class={style.label}>Favorite fruit</Label>
			<Input class={style.input} placeholder="e.g. Apple" />
			<Description class={style.description}>
				Choose the fruit you like the most.
			</Description>
		</Root>
	),
});

/** `validationState="invalid"` reveals the error message and applies `data-invalid` to all parts. */
export const WithError = meta.story({
	name: "With Error",
	render: () => {
		const [value, setValue] = createSignal("Orange");
		return (
			<Root
				class={style.root}
				value={value()}
				onChange={setValue}
				validationState={value() !== "Apple" ? "invalid" : "valid"}
			>
				<Label class={style.label}>Favorite fruit</Label>
				<Input class={style.input} />
				<ErrorMessage class={style.error}>Hmm, I prefer apples.</ErrorMessage>
			</Root>
		);
	},
});

/** `disabled` makes the field non-interactive. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={style.root} disabled defaultValue="Mango">
			<Label class={style.label}>Favorite fruit</Label>
			<Input class={style.input} />
			<Description class={style.description}>
				You cannot change this.
			</Description>
		</Root>
	),
});

/** `readOnly` displays the value without allowing edits. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={style.root} readOnly defaultValue="Pineapple">
			<Label class={style.label}>Favorite fruit</Label>
			<Input class={style.input} />
		</Root>
	),
});

/** Multi-line `TextArea` variant. */
export const WithTextArea = meta.story({
	name: "TextArea",
	render: () => (
		<Root class={style.root}>
			<Label class={style.label}>Message</Label>
			<TextArea class={style.textarea} placeholder="Type your message…" />
		</Root>
	),
});

/** `autoResize` grows the textarea as the user types. */
export const AutoResizeTextArea = meta.story({
	name: "TextArea Auto Resize",
	render: () => (
		<Root class={style.root}>
			<Label class={style.label}>Message</Label>
			<TextArea
				autoResize
				class={style.textareaNoResize}
				placeholder="This textarea grows as you type…"
			/>
			<Description class={style.description}>
				The textarea expands with the content.
			</Description>
		</Root>
	),
});

/**
 * `value` is driven entirely by the Controls panel — change it there to update the field.
 */
export const Controlled = meta.story({
	name: "Controlled",
	args: {
		value: "Apple",
	},
	argTypes: {
		value: {
			control: "text",
			description: "Set the field value from the Controls panel.",
		},
	},
	render: (args) => (
		<Root class={style.root} value={args.value ?? ""}>
			<Label class={style.label}>Favorite fruit</Label>
			<Input class={style.input} />
		</Root>
	),
});

/** Full form with label, description, error message, and all variants. */
export const FullForm = meta.story({
	name: "Full Form",
	render: () => {
		const [name, setName] = createSignal("");
		const [email, setEmail] = createSignal("");

		const emailValid = () =>
			!email() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email());

		return (
			<form class={style.form} onSubmit={(e) => e.preventDefault()}>
				<Root class={style.formRoot} value={name()} onChange={setName} required>
					<Label class={style.label}>Full name</Label>
					<Input class={style.input} placeholder="Jane Doe" />
					<Description class={style.description}>
						As it appears on your ID.
					</Description>
				</Root>

				<Root
					class={style.formRoot}
					value={email()}
					onChange={setEmail}
					validationState={emailValid() ? "valid" : "invalid"}
					required
				>
					<Label class={style.label}>Email address</Label>
					<Input class={style.input} placeholder="jane@example.com" />
					<ErrorMessage class={style.error}>
						Please enter a valid email address.
					</ErrorMessage>
				</Root>

				<button type="submit" class={style.submitButton}>
					Submit
				</button>
			</form>
		);
	},
});
