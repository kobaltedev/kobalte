import { ColorChannelField } from "@kobalte/core/color-channel-field";
import { parseColor } from "@kobalte/core/colors";
import { createSignal } from "solid-js";
import { ArrowIcon } from "../components";
import style from "./color-channel-field.module.css";

export function BasicExample() {
	return (
		<ColorChannelField
			class={style["color-channel-field"]}
			defaultValue={parseColor("hsl(200, 98%, 39%)")}
			channel="hue"
		>
			<ColorChannelField.Label class={style["color-channel-field__label"]}>
				Hue
			</ColorChannelField.Label>
			<div class={style["color-channel-field__group"]}>
				<ColorChannelField.Input class={style["color-channel-field__input"]} />
				<ColorChannelField.IncrementTrigger
					aria-label="Increment"
					class={style["color-channel-field__increment"]}
				>
					<ArrowIcon />
				</ColorChannelField.IncrementTrigger>
				<ColorChannelField.DecrementTrigger
					aria-label="Decrement"
					class={style["color-channel-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</ColorChannelField.DecrementTrigger>
			</div>
		</ColorChannelField>
	);
}

export function DefaultValueExample() {
	return (
		<ColorChannelField
			class={style["color-channel-field"]}
			defaultValue={parseColor("hsl(200, 98%, 39%)")}
			channel="saturation"
		>
			<ColorChannelField.Label class={style["color-channel-field__label"]}>
				Saturation
			</ColorChannelField.Label>
			<div class={style["color-channel-field__group"]}>
				<ColorChannelField.Input class={style["color-channel-field__input"]} />
				<ColorChannelField.IncrementTrigger
					aria-label="Increment"
					class={style["color-channel-field__increment"]}
				>
					<ArrowIcon />
				</ColorChannelField.IncrementTrigger>
				<ColorChannelField.DecrementTrigger
					aria-label="Decrement"
					class={style["color-channel-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</ColorChannelField.DecrementTrigger>
			</div>
		</ColorChannelField>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal(parseColor("hsl(200, 98%, 39%)"));

	return (
		<>
			<ColorChannelField
				class={style["color-channel-field"]}
				value={value()}
				channel="lightness"
				onChange={setValue}
			>
				<ColorChannelField.Label class={style["color-channel-field__label"]}>
					Lightness
				</ColorChannelField.Label>
				<div class={style["color-channel-field__group"]}>
					<ColorChannelField.Input
						class={style["color-channel-field__input"]}
					/>
					<ColorChannelField.IncrementTrigger
						aria-label="Increment"
						class={style["color-channel-field__increment"]}
					>
						<ArrowIcon />
					</ColorChannelField.IncrementTrigger>
					<ColorChannelField.DecrementTrigger
						aria-label="Decrement"
						class={style["color-channel-field__decrement"]}
					>
						<ArrowIcon style="transform: rotate(180deg);" />
					</ColorChannelField.DecrementTrigger>
				</div>
			</ColorChannelField>

			<p class="not-prose text-sm mt-4">
				Lightness: {value().getChannelValue("lightness")}%
			</p>
		</>
	);
}

export function DescriptionExample() {
	return (
		<ColorChannelField
			class={style["color-channel-field"]}
			defaultValue={parseColor("hsl(0, 98%, 39%)")}
			channel="hue"
		>
			<ColorChannelField.Label class={style["color-channel-field__label"]}>
				Hue
			</ColorChannelField.Label>
			<div class={style["color-channel-field__group"]}>
				<ColorChannelField.Input class={style["color-channel-field__input"]} />
				<ColorChannelField.IncrementTrigger
					aria-label="Increment"
					class={style["color-channel-field__increment"]}
				>
					<ArrowIcon />
				</ColorChannelField.IncrementTrigger>
				<ColorChannelField.DecrementTrigger
					aria-label="Decrement"
					class={style["color-channel-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</ColorChannelField.DecrementTrigger>
			</div>
			<ColorChannelField.Description
				class={style["color-channel-field__description"]}
			>
				Enter your favorite hue.
			</ColorChannelField.Description>
		</ColorChannelField>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal(parseColor("hsl(200, 30%, 39%)"));

	return (
		<ColorChannelField
			class={style["color-channel-field"]}
			value={value()}
			channel="saturation"
			onChange={setValue}
			validationState={
				value().getChannelValue("saturation") !== 40 ? "invalid" : "valid"
			}
		>
			<ColorChannelField.Label class={style["color-channel-field__label"]}>
				Saturation
			</ColorChannelField.Label>
			<div class={style["color-channel-field__group"]}>
				<ColorChannelField.Input class={style["color-channel-field__input"]} />
				<ColorChannelField.IncrementTrigger
					aria-label="Increment"
					class={style["color-channel-field__increment"]}
				>
					<ArrowIcon />
				</ColorChannelField.IncrementTrigger>
				<ColorChannelField.DecrementTrigger
					aria-label="Decrement"
					class={style["color-channel-field__decrement"]}
				>
					<ArrowIcon style="transform: rotate(180deg);" />
				</ColorChannelField.DecrementTrigger>
			</div>
			<ColorChannelField.ErrorMessage
				class={style["color-channel-field__error-message"]}
			>
				Hmm, I prefer 40% saturation.
			</ColorChannelField.ErrorMessage>
		</ColorChannelField>
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
			<ColorChannelField
				class={style["color-channel-field"]}
				name="hue"
				defaultValue={parseColor("hsl(10, 98%, 39%)")}
				channel="hue"
			>
				<ColorChannelField.Label class={style["color-channel-field__label"]}>
					Hue
				</ColorChannelField.Label>
				<ColorChannelField.HiddenInput />
				<div class={style["color-channel-field__group"]}>
					<ColorChannelField.Input
						class={style["color-channel-field__input"]}
					/>
					<ColorChannelField.IncrementTrigger
						aria-label="Increment"
						class={style["color-channel-field__increment"]}
					>
						<ArrowIcon />
					</ColorChannelField.IncrementTrigger>
					<ColorChannelField.DecrementTrigger
						aria-label="Decrement"
						class={style["color-channel-field__decrement"]}
					>
						<ArrowIcon style="transform: rotate(180deg);" />
					</ColorChannelField.DecrementTrigger>
				</div>
			</ColorChannelField>
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

export function TriggersExample() {
	return (
		<ColorChannelField
			class={style["color-channel-field"]}
			defaultValue={parseColor("hsb(10, 98%, 50%)")}
			channel="brightness"
		>
			<ColorChannelField.Label class={style["color-channel-field__label"]}>
				Brightness
			</ColorChannelField.Label>
			<div class={style["color-channel-field__group"]}>
				<ColorChannelField.DecrementTrigger
					aria-label="Decrement"
					class={style["color-channel-field__custom-trigger-decrement"]}
				>
					-
				</ColorChannelField.DecrementTrigger>
				<ColorChannelField.Input class={style["color-channel-field__input"]} />
				<ColorChannelField.IncrementTrigger
					aria-label="Increment"
					class={style["color-channel-field__custom-trigger-increment"]}
				>
					+
				</ColorChannelField.IncrementTrigger>
			</div>
		</ColorChannelField>
	);
}
