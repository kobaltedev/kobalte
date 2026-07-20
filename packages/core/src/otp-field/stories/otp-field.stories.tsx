import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Input,
	Label,
	Root,
	useOTPFieldContext,
} from "../index.tsx";
import style from "./stories.module.css";

const meta = preview.meta({
	title: "Components/OTPField",
	tags: ["autodocs"],
});

export default meta;

function OtpSlot(props: { index: number }) {
	const context = useOTPFieldContext();

	const char = () => context.value()[props.index];
	const isActive = () => context.activeSlots().includes(props.index);
	const showCaret = () =>
		context.isInserting() && context.activeSlots()[0] === props.index;

	return (
		<div class={`${style.slot} ${isActive() ? style.slotActive : ""}`}>
			{char()}
			{showCaret() && (
				<div class={style.caret}>
					<div class={style.caretLine} />
				</div>
			)}
		</div>
	);
}

function makeSlots(n: number) {
	return Array.from({ length: n }, (_, i) => i);
}

/** Basic 6-digit OTP field. */
export const Default = meta.story({
	name: "Default",
	render: () => (
		<Root maxLength={6} class={style.root}>
			<Input />
			<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
		</Root>
	),
});

/** Controlled with value signal and completion callback. */
export const Controlled = meta.story({
	name: "Controlled",
	render: () => {
		const [value, setValue] = createSignal("");
		return (
			<div class={style.controlledWrapper}>
				<Root
					maxLength={6}
					value={value()}
					onChange={setValue}
					onComplete={(v) => console.log("Complete:", v)}
					class={style.root}
				>
					<Input />
					<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
				</Root>
				<p class={style.stateText}>Value: {value()}</p>
			</div>
		);
	},
});

function AnimatedOtpSlot(props: { index: number }) {
	const context = useOTPFieldContext();
	const char = () => context.value()[props.index];
	const isActive = () => context.activeSlots().includes(props.index);
	const showCaret = () =>
		context.isInserting() && context.activeSlots()[0] === props.index;

	return (
		<div class={`${style.slot} ${isActive() ? style.slotActive : ""}`}>
			{showCaret() ? (
				<div class={style.caret}>
					<div class={style.caretLine} />
				</div>
			) : (
				<span class={style.charPopIn}>{char()}</span>
			)}
		</div>
	);
}

/** Numbers pop in as each digit is typed. */
export const Animated = meta.story({
	name: "Animated",
	render: () => (
		<>
			<Root maxLength={6} class={style.root}>
				<Input />
				<For each={makeSlots(6)}>{(i) => <AnimatedOtpSlot index={i} />}</For>
			</Root>
		</>
	),
});

/** Form controls: label, description, error message, validation state, disabled, and read-only. */
export const FormControls = meta.story({
	name: "Form Controls",
	render: () => {
		const [value, setValue] = createSignal("");
		const isInvalid = () => value().length > 0 && value().length < 6;

		return (
			<div class={style.formControls}>
				<div class={style.formSection}>
					<Root
						maxLength={6}
						value={value()}
						onChange={setValue}
						validationState={isInvalid() ? "invalid" : "valid"}
					>
						<Label class={style.label}>Verification code</Label>
						<div class={style.slotRow}>
							<Input />
							<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
						</div>
						<Description class={style.description}>
							Enter the 6-digit code sent to your device.
						</Description>
						<ErrorMessage class={style.error}>
							Please enter all 6 digits.
						</ErrorMessage>
					</Root>
				</div>

				<div class={style.formSection}>
					<Root maxLength={6} defaultValue="123" disabled>
						<Label class={style.labelDisabled}>Disabled field</Label>
						<div class={style.slotRowDisabled}>
							<Input />
							<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
						</div>
					</Root>
				</div>

				<div class={style.formSection}>
					<Root maxLength={6} defaultValue="456789" readOnly>
						<Label class={style.label}>Read-only field</Label>
						<div class={style.slotRow}>
							<Input />
							<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
						</div>
						<Description class={style.description}>
							This value cannot be edited.
						</Description>
					</Root>
				</div>
			</div>
		);
	},
});

/** Alphabetic-only OTP (pattern overridden to allow letters). */
export const AlphaPattern = meta.story({
	name: "Alpha Pattern",
	render: () => (
		<Root maxLength={4} class={style.root}>
			<Input pattern="^[a-zA-Z]*$" />
			<For each={makeSlots(4)}>{(i) => <OtpSlot index={i} />}</For>
		</Root>
	),
});
