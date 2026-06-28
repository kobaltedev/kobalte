import { createSignal, For } from "solid-js";
import preview from "../../../../../.storybook/preview.js";
import {
	Description,
	ErrorMessage,
	Input,
	Label,
	Root,
	useOTPFieldContext,
} from "../index";

const meta = preview.meta({
	title: "Components/OTPField",
	tags: ["autodocs"],
});

export default meta;

// Slot component that renders a single character cell with active/caret state.
function OtpSlot(props: { index: number }) {
	const context = useOTPFieldContext();

	const char = () => context.value()[props.index];
	const isActive = () => context.activeSlots().includes(props.index);
	const showCaret = () =>
		context.isInserting() && context.activeSlots()[0] === props.index;

	return (
		<div
			class={[
				"relative flex h-12 w-10 items-center justify-center rounded-md border text-sm font-medium transition-all",
				isActive()
					? "border-blue-500 ring-2 ring-blue-500/30"
					: "border-slate-300",
			].join(" ")}
		>
			{char()}
			{showCaret() && (
				<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div class="h-5 w-px bg-slate-900" />
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
		<Root maxLength={6} class="flex gap-2 font-sans">
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
			<div class="flex flex-col gap-4 font-sans">
				<Root
					maxLength={6}
					value={value()}
					onChange={setValue}
					onComplete={(v) => console.log("Complete:", v)}
					class="flex gap-2"
				>
					<Input />
					<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
				</Root>
				<p class="text-sm text-slate-600">Value: {value()}</p>
			</div>
		);
	},
});

// Exclusive caret-or-char: the char <span> mounts fresh on each keystroke,
// triggering the CSS pop-in animation without any JS.
function AnimatedOtpSlot(props: { index: number }) {
	const context = useOTPFieldContext();
	const char = () => context.value()[props.index];
	const isActive = () => context.activeSlots().includes(props.index);
	const showCaret = () =>
		context.isInserting() && context.activeSlots()[0] === props.index;

	return (
		<div
			class={[
				"relative flex h-12 w-10 items-center justify-center rounded-md border text-sm font-medium transition-all",
				isActive()
					? "border-blue-500 ring-2 ring-blue-500/30"
					: "border-slate-300",
			].join(" ")}
		>
			{showCaret() ? (
				<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div class="h-5 w-px bg-slate-900" />
				</div>
			) : (
				<span class="otp-pop-in">{char()}</span>
			)}
		</div>
	);
}

/** Numbers pop in as each digit is typed. */
export const Animated = meta.story({
	name: "Animated",
	render: () => (
		<>
			<style>{`
				@keyframes otp-slip-in {
					from { transform: translateY(8px); opacity: 0; }
					to { transform: translateY(0); opacity: 1; }
				}
				.otp-pop-in {
					display: inline-block;
					animation: otp-slip-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
				}
			`}</style>
			<Root maxLength={6} class="flex gap-2 font-sans">
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
			<div class="flex flex-col gap-10 font-sans">
				{/* Validation */}
				<div class="flex flex-col gap-1.5">
					<Root
						maxLength={6}
						value={value()}
						onChange={setValue}
						validationState={isInvalid() ? "invalid" : "valid"}
					>
						<Label class="text-sm font-medium text-slate-700">
							Verification code
						</Label>
						<div class="mt-1 flex gap-2">
							<Input />
							<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
						</div>
						<Description class="mt-1 text-xs text-slate-500">
							Enter the 6-digit code sent to your device.
						</Description>
						<ErrorMessage class="mt-1 text-xs text-red-600">
							Please enter all 6 digits.
						</ErrorMessage>
					</Root>
				</div>

				{/* Disabled */}
				<div class="flex flex-col gap-1.5">
					<Root maxLength={6} defaultValue="123" disabled>
						<Label class="text-sm font-medium text-slate-400">
							Disabled field
						</Label>
						<div class="mt-1 flex gap-2 opacity-50">
							<Input />
							<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
						</div>
					</Root>
				</div>

				{/* Read-only */}
				<div class="flex flex-col gap-1.5">
					<Root maxLength={6} defaultValue="456789" readOnly>
						<Label class="text-sm font-medium text-slate-700">
							Read-only field
						</Label>
						<div class="mt-1 flex gap-2">
							<Input />
							<For each={makeSlots(6)}>{(i) => <OtpSlot index={i} />}</For>
						</div>
						<Description class="mt-1 text-xs text-slate-500">
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
		<Root maxLength={4} class="flex gap-2 font-sans">
			<Input pattern="^[a-zA-Z]*$" />
			<For each={makeSlots(4)}>{(i) => <OtpSlot index={i} />}</For>
		</Root>
	),
});
