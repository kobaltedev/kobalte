import { OTPField, useOTPFieldContext } from "@kobalte/core/otp-field";
import { createSignal, For } from "solid-js";

import style from "./otp-field.module.css";

function makeSlots(n: number) {
	return Array.from({ length: n }, (_, i) => i);
}

function OtpSlot(props: { index: number }) {
	const context = useOTPFieldContext();
	const char = () => context.value()[props.index];
	const isActive = () => context.activeSlots().includes(props.index);
	const showCaret = () =>
		context.isInserting() && context.activeSlots()[0] === props.index;

	return (
		<div
			class={style["otp-field__slot"]}
			data-active={isActive() ? "" : undefined}
		>
			{showCaret() ? <div class={style["otp-field__caret"]} /> : char()}
		</div>
	);
}

export function BasicExample() {
	return (
		<OTPField maxLength={6} class={style["otp-field"]}>
			<OTPField.Input />
			<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
		</OTPField>
	);
}

export function DefaultValueExample() {
	return (
		<OTPField maxLength={6} defaultValue="123" class={style["otp-field"]}>
			<OTPField.Input />
			<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
		</OTPField>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal("");

	return (
		<>
			<OTPField
				maxLength={6}
				value={value()}
				onChange={setValue}
				class={style["otp-field"]}
			>
				<OTPField.Input />
				<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
			</OTPField>
			<p class="not-prose text-sm mt-4">Value: {value()}</p>
		</>
	);
}

export function OnCompleteExample() {
	const [status, setStatus] = createSignal("Enter your 6-digit code.");

	return (
		<>
			<OTPField
				maxLength={6}
				onComplete={(v) => setStatus(`Code submitted: ${v}`)}
				onChange={() => setStatus("Enter your 6-digit code.")}
				class={style["otp-field"]}
			>
				<OTPField.Input />
				<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
			</OTPField>
			<p class="not-prose text-sm mt-4">{status()}</p>
		</>
	);
}

export function CustomPatternExample() {
	return (
		<OTPField maxLength={4} class={style["otp-field"]}>
			<OTPField.Input pattern="^[a-zA-Z]*$" />
			<For each={makeSlots(4)}>{(i) => <OtpSlot index={i} />}</For>
		</OTPField>
	);
}

// AnimatedOtpSlot uses an exclusive caret-or-char render so the char <span>
// mounts fresh on every keystroke, which naturally fires the CSS pop-in animation.
function AnimatedOtpSlot(props: { index: number }) {
	const context = useOTPFieldContext();
	const char = () => context.value()[props.index];
	const isActive = () => context.activeSlots().includes(props.index);
	const showCaret = () =>
		context.isInserting() && context.activeSlots()[0] === props.index;

	return (
		<div
			class={style["otp-field__slot"]}
			data-active={isActive() ? "" : undefined}
		>
			{showCaret() ? (
				<div class={style["otp-field__caret"]} />
			) : (
				<span class={style["otp-field__char"]}>{char()}</span>
			)}
		</div>
	);
}

export function AnimatedExample() {
	return (
		<OTPField maxLength={6} class={style["otp-field"]}>
			<OTPField.Input />
			<For each={makeSlots(6)}>{(i) => <AnimatedOtpSlot index={i} />}</For>
		</OTPField>
	);
}

export function ValidationExample() {
	const [value, setValue] = createSignal("");

	const isInvalid = () => value().length > 0 && value().length < 6;

	return (
		<div class="flex flex-col gap-2">
			<OTPField
				maxLength={6}
				value={value()}
				onChange={setValue}
				validationState={isInvalid() ? "invalid" : "valid"}
				class={style["otp-field"]}
			>
				<OTPField.Label class="text-sm font-medium text-slate-700 dark:text-slate-300">
					Verification code
				</OTPField.Label>
				<div class="flex items-center gap-2 mt-1">
					<OTPField.Input />
					<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
				</div>
				<OTPField.Description class="text-sm text-slate-500 mt-1">
					Enter the 6-digit code sent to your device.
				</OTPField.Description>
				<OTPField.ErrorMessage class="text-sm text-red-600 mt-1">
					Please enter all 6 digits.
				</OTPField.ErrorMessage>
			</OTPField>
		</div>
	);
}

export function HTMLFormExample() {
	let formRef: HTMLFormElement | undefined;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const formData = new FormData(formRef);
		alert(JSON.stringify(Object.fromEntries(formData), null, 2));
	};

	return (
		<form
			ref={formRef}
			onSubmit={onSubmit}
			class="flex flex-col items-center space-y-6"
		>
			<OTPField maxLength={6} class={style["otp-field"]}>
				<OTPField.Input name="otp" />
				<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
			</OTPField>
			<div class="flex space-x-2">
				<button type="reset" class="kb-button">
					Reset
				</button>
				<button type="submit" class="kb-button-primary">
					Submit
				</button>
			</div>
		</form>
	);
}
