import { createSignal } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Input,
	Label,
	Root,
	TextArea,
} from "../index";

const meta = preview.meta({
	title: "Components/TextField",
	tags: ["autodocs"],
});

export default meta;

const rootClass = "flex flex-col gap-1.5 w-72 font-sans";
const labelClass = "text-sm font-medium text-slate-700";
const inputClass =
	"rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-slate-50 data-[invalid]:border-red-500 data-[invalid]:ring-red-500 w-full";
const descriptionClass = "text-xs text-slate-500";
const errorClass = "text-xs text-red-600";

/** Basic text input with a label. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root class={rootClass}>
			<Label class={labelClass}>Favorite fruit</Label>
			<Input class={inputClass} placeholder="e.g. Apple" />
		</Root>
	),
});

/** Pre-populated via `defaultValue` — uncontrolled. */
export const DefaultValue = meta.story({
	name: "Default Value",
	render: () => (
		<Root class={rootClass} defaultValue="Apple">
			<Label class={labelClass}>Favorite fruit</Label>
			<Input class={inputClass} />
		</Root>
	),
});

/** Description provides supplementary hint text below the input. */
export const WithDescription = meta.story({
	name: "With Description",
	render: () => (
		<Root class={rootClass}>
			<Label class={labelClass}>Favorite fruit</Label>
			<Input class={inputClass} placeholder="e.g. Apple" />
			<Description class={descriptionClass}>
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
				class={rootClass}
				value={value()}
				onChange={setValue}
				validationState={value() !== "Apple" ? "invalid" : "valid"}
			>
				<Label class={labelClass}>Favorite fruit</Label>
				<Input class={inputClass} />
				<ErrorMessage class={errorClass}>Hmm, I prefer apples.</ErrorMessage>
			</Root>
		);
	},
});

/** `disabled` makes the field non-interactive. */
export const Disabled = meta.story({
	name: "Disabled",
	render: () => (
		<Root class={rootClass} disabled defaultValue="Mango">
			<Label class={labelClass}>Favorite fruit</Label>
			<Input class={inputClass} />
			<Description class={descriptionClass}>You cannot change this.</Description>
		</Root>
	),
});

/** `readOnly` displays the value without allowing edits. */
export const ReadOnly = meta.story({
	name: "Read Only",
	render: () => (
		<Root class={rootClass} readOnly defaultValue="Pineapple">
			<Label class={labelClass}>Favorite fruit</Label>
			<Input class={inputClass} />
		</Root>
	),
});

/** Multi-line `TextArea` variant. */
export const WithTextArea = meta.story({
	name: "TextArea",
	render: () => (
		<Root class={rootClass}>
			<Label class={labelClass}>Message</Label>
			<TextArea
				class={`${inputClass} min-h-24 resize-y`}
				placeholder="Type your message…"
			/>
		</Root>
	),
});

/** `autoResize` grows the textarea as the user types. */
export const AutoResizeTextArea = meta.story({
	name: "TextArea Auto Resize",
	render: () => (
		<Root class={rootClass}>
			<Label class={labelClass}>Message</Label>
			<TextArea
				autoResize
				class={`${inputClass} resize-none`}
				placeholder="This textarea grows as you type…"
			/>
			<Description class={descriptionClass}>The textarea expands with the content.</Description>
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
		value: { control: "text", description: "Set the field value from the Controls panel." },
	},
	render: (args) => (
		<Root class={rootClass} value={args.value ?? ""}>
			<Label class={labelClass}>Favorite fruit</Label>
			<Input class={inputClass} />
		</Root>
	),
});

const formRootClass = "flex flex-col gap-1.5 w-full font-sans";

/** Full form with label, description, error message, and all variants. */
export const FullForm = meta.story({
	name: "Full Form",
	render: () => {
		const [name, setName] = createSignal("");
		const [email, setEmail] = createSignal("");

		const emailValid = () => !email() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email());

		return (
			<form
				class="flex flex-col gap-4 w-72 font-sans"
				onSubmit={(e) => e.preventDefault()}
			>
				<Root class={formRootClass} value={name()} onChange={setName} required>
					<Label class={labelClass}>Full name</Label>
					<Input class={inputClass} placeholder="Jane Doe" />
					<Description class={descriptionClass}>As it appears on your ID.</Description>
				</Root>

				<Root
					class={formRootClass}
					value={email()}
					onChange={setEmail}
					validationState={emailValid() ? "valid" : "invalid"}
					required
				>
					<Label class={labelClass}>Email address</Label>
					<Input class={inputClass} placeholder="jane@example.com" />
					<ErrorMessage class={errorClass}>Please enter a valid email address.</ErrorMessage>
				</Root>

				<button
					type="submit"
					class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
				>
					Submit
				</button>
			</form>
		);
	},
});
