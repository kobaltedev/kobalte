import { NumberField } from "@kobalte/core";
import { createSignal } from "solid-js";

import { ArrowIcon } from "../components";
import style from "./number-field.module.css";

export function BasicExample() {
	return (
		<NumberField.Root class={style["number-field"]}>
			<NumberField.Label class={style["number-field__label"]}>
				Quantity
			</NumberField.Label>
			<div class={style["number-field__group"]}>
				<NumberField.Input class={style["number-field__input"]} />
				<NumberField.IncrementTrigger
					aria-label="Increment"
					class={style["number-field__increment"]}
				>
					<ArrowIcon />
				</NumberField.IncrementTrigger>
				<NumberField.DecrementTrigger
					aria-label="Decrement"
					class={style["number-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</NumberField.DecrementTrigger>
			</div>
		</NumberField.Root>
	);
}

export function DefaultValueExample() {
	return (
		<NumberField.Root class={style["number-field"]} defaultValue={40}>
			<NumberField.Label class={style["number-field__label"]}>
				Quantity
			</NumberField.Label>
			<div class={style["number-field__group"]}>
				<NumberField.Input class={style["number-field__input"]} />
				<NumberField.IncrementTrigger
					aria-label="Increment"
					class={style["number-field__increment"]}
				>
					<ArrowIcon />
				</NumberField.IncrementTrigger>
				<NumberField.DecrementTrigger
					aria-label="Decrement"
					class={style["number-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</NumberField.DecrementTrigger>
			</div>
		</NumberField.Root>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal("40");
	const [rawValue, setRawValue] = createSignal(0);

	return (
		<>
			<NumberField.Root
				class={style["number-field"]}
				value={value()}
				onChange={setValue}
				onRawValueChange={setRawValue}
			>
				<NumberField.Label class={style["number-field__label"]}>
					Quantity
				</NumberField.Label>
				<div class={style["number-field__group"]}>
					<NumberField.Input class={style["number-field__input"]} />
					<NumberField.IncrementTrigger
						aria-label="Increment"
						class={style["number-field__increment"]}
					>
						<ArrowIcon />
					</NumberField.IncrementTrigger>
					<NumberField.DecrementTrigger
						aria-label="Decrement"
						class={style["number-field__decrement"]}
					>
						<ArrowIcon style="transform: rotate(180deg);" />
					</NumberField.DecrementTrigger>
				</div>
			</NumberField.Root>

			<p class="not-prose text-sm mt-4">
				Quantity: {value()}. Raw: {rawValue()}.
			</p>
		</>
	);
}

export function DescriptionExample() {
	return (
		<NumberField.Root class={style["number-field"]}>
			<NumberField.Label class={style["number-field__label"]}>
				Quantity
			</NumberField.Label>
			<div class={style["number-field__group"]}>
				<NumberField.Input class={style["number-field__input"]} />
				<NumberField.IncrementTrigger
					aria-label="Increment"
					class={style["number-field__increment"]}
				>
					<ArrowIcon />
				</NumberField.IncrementTrigger>
				<NumberField.DecrementTrigger
					aria-label="Decrement"
					class={style["number-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</NumberField.DecrementTrigger>
			</div>
			<NumberField.Description class={style["number-field__description"]}>
				Choose a quantity.
			</NumberField.Description>
		</NumberField.Root>
	);
}

export function ErrorMessageExample() {
	const [rawValue, setRawValue] = createSignal<number>();

	return (
		<NumberField.Root
			class={style["number-field"]}
			onChange={setRawValue}
			validationState={rawValue() !== 40 ? "invalid" : "valid"}
		>
			<NumberField.Label class={style["number-field__label"]}>
				Quantity
			</NumberField.Label>
			<div class={style["number-field__group"]}>
				<NumberField.Input class={style["number-field__input"]} />
				<NumberField.IncrementTrigger
					aria-label="Increment"
					class={style["number-field__increment"]}
				>
					<ArrowIcon />
				</NumberField.IncrementTrigger>
				<NumberField.DecrementTrigger
					aria-label="Decrement"
					class={style["number-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</NumberField.DecrementTrigger>
			</div>
			<NumberField.ErrorMessage class={style["number-field__error-message"]}>
				Hmm, I prefer 40.
			</NumberField.ErrorMessage>
		</NumberField.Root>
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
			<NumberField.Root class={style["number-field"]} name="favorite-fruit">
				<NumberField.Label class={style["number-field__label"]}>
					Favorite fruit
				</NumberField.Label>
				<NumberField.Input class={style["number-field__input"]} />
			</NumberField.Root>
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
