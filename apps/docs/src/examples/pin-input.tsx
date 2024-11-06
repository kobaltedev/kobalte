import { Index, createSignal } from "solid-js";
import { PinInput } from "../../../../packages/core/src/pin-input";

import style from "./pin-input.module.css";

export function BasicExample() {
	return (
		<PinInput class={style["pin-input"]}>
			<PinInput.Label class={style["pin-input__label"]}>PIN</PinInput.Label>
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
		</PinInput>
	);
}

export function DefaultValueExample() {
	return (
		<PinInput class={style["pin-input"]} defaultValue={["9", "9", "9"]}>
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
		</PinInput>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal([]);

	return (
		<>
			<PinInput class={style["pin-input"]} value={value()} onChange={setValue}>
				<PinInput.Control class={style["pin-input__control"]}>
					<Index each={Array(3)}>
						{(_) => <PinInput.Input class={style["pin-input__input"]} />}
					</Index>
				</PinInput.Control>
			</PinInput>
			<p class="not-prose text-sm mt-4">PIN code is: {value().join("")}</p>
		</>
	);
}

export function PlaceholderExample() {
	return (
		<PinInput class={style["pin-input"]} placeholder="*">
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
		</PinInput>
	);
}

export function BlurOnCompleteExample() {
	return (
		<PinInput class={style["pin-input"]} blurOnComplete>
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
		</PinInput>
	);
}

export function OTPExample() {
	return (
		<PinInput class={style["pin-input"]} otp>
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
		</PinInput>
	);
}

export function MaskExample() {
	return (
		<PinInput class={style["pin-input"]} mask>
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
		</PinInput>
	);
}

export function TypeExample() {
	return (
		<PinInput class={style["pin-input"]} type="alphanumeric">
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
		</PinInput>
	);
}

export function DescriptionExample() {
	return (
		<PinInput class={style["pin-input"]}>
			<PinInput.Label class={style["pin-input__label"]}>PIN</PinInput.Label>
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
			<PinInput.Description class={style["pin-input__description"]}>
				Enter your 3 digit PIN code.
			</PinInput.Description>
		</PinInput>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal([]);

	return (
		<PinInput
			class={style["pin-input"]}
			value={value()}
			onChange={setValue}
			validationState={
				value().every((element) => element === "9") ? "valid" : "invalid"
			}
		>
			<PinInput.Label class={style["pin-input__label"]}>PIN</PinInput.Label>
			<PinInput.Control class={style["pin-input__control"]}>
				<Index each={Array(3)}>
					{(_) => <PinInput.Input class={style["pin-input__input"]} />}
				</Index>
			</PinInput.Control>
			<PinInput.ErrorMessage class={style["pin-input__error-message"]}>
				Incorrect PIN. Please try again.
			</PinInput.ErrorMessage>
		</PinInput>
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
			<PinInput class={style["pin-input"]} name="PIN">
				<PinInput.Control class={style["pin-input__control"]}>
					<Index each={Array(3)}>
						{(_) => <PinInput.Input class={style["pin-input__input"]} />}
					</Index>
				</PinInput.Control>
				<PinInput.HiddenInput />
			</PinInput>
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
