import { ColorField } from "@kobalte/core/color-field";
import { createSignal } from "solid-js";

import style from "./color-field.module.css";

export function BasicExample() {
	return (
		<ColorField class={style["color-field"]}>
			<ColorField.Label class={style["color-field__label"]}>
				Favorite color
			</ColorField.Label>
			<ColorField.Input class={style["color-field__input"]} />
		</ColorField>
	);
}

export function DefaultValueExample() {
	return (
		<ColorField class={style["color-field"]} defaultValue="#7f007f">
			<ColorField.Label class={style["color-field__label"]}>
				Favorite color
			</ColorField.Label>
			<ColorField.Input class={style["color-field__input"]} />
		</ColorField>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal("#7f007f");

	return (
		<>
			<ColorField
				class={style["color-field"]}
				value={value()}
				onChange={setValue}
			>
				<ColorField.Label class={style["color-field__label"]}>
					Favorite color
				</ColorField.Label>
				<ColorField.Input class={style["color-field__input"]} />
			</ColorField>
			<p class="not-prose text-sm mt-4">Your favorite color is: {value()}</p>
		</>
	);
}

export function DescriptionExample() {
	return (
		<ColorField class={style["color-field"]}>
			<ColorField.Label class={style["color-field__label"]}>
				Favorite color
			</ColorField.Label>
			<ColorField.Input class={style["color-field__input"]} />
			<ColorField.Description class={style["color-field__description"]}>
				Choose the color you like the most.
			</ColorField.Description>
		</ColorField>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal("#7f007f");

	return (
		<ColorField
			class={style["color-field"]}
			value={value()}
			onChange={setValue}
			validationState={value() !== "#000000" ? "invalid" : "valid"}
		>
			<ColorField.Label class={style["color-field__label"]}>
				Favorite color
			</ColorField.Label>
			<ColorField.Input class={style["color-field__input"]} />
			<ColorField.ErrorMessage class={style["color-field__error-message"]}>
				Hmm, I prefer black.
			</ColorField.ErrorMessage>
		</ColorField>
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
			<ColorField class={style["color-field"]} name="favorite-color">
				<ColorField.Label class={style["color-field__label"]}>
					Favorite color
				</ColorField.Label>
				<ColorField.Input class={style["color-field__input"]} />
			</ColorField>
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
