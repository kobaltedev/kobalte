import { Switch } from "@kobalte/core/switch";
import { createSignal } from "solid-js";

import style from "./switch.module.css";

export function BasicExample() {
	return (
		<Switch class={style.switch}>
			<Switch.Label class={style.switch__label}>Airplane mode</Switch.Label>
			<Switch.Input class={style.switch__input} />
			<Switch.Control class={style.switch__control}>
				<Switch.Thumb class={style.switch__thumb} />
			</Switch.Control>
		</Switch>
	);
}

export function DefaultCheckedExample() {
	return (
		<Switch class={style.switch} defaultChecked>
			<Switch.Label class={style.switch__label}>Airplane mode</Switch.Label>
			<Switch.Input class={style.switch__input} />
			<Switch.Control class={style.switch__control}>
				<Switch.Thumb class={style.switch__thumb} />
			</Switch.Control>
		</Switch>
	);
}

export function ControlledExample() {
	const [checked, setChecked] = createSignal(false);

	return (
		<>
			<Switch class={style.switch} checked={checked()} onChange={setChecked}>
				<Switch.Label class={style.switch__label}>Airplane mode</Switch.Label>
				<Switch.Input class={style.switch__input} />
				<Switch.Control class={style.switch__control}>
					<Switch.Thumb class={style.switch__thumb} />
				</Switch.Control>
			</Switch>
			<p class="not-prose text-sm mt-2">
				Airplane mode is {checked() ? "active" : "inactive"}.
			</p>
		</>
	);
}

export function DescriptionExample() {
	return (
		<Switch class={style.switch}>
			<div class="flex flex-col items-start  mr-2">
				<Switch.Label class={style.switch__label}>Airplane mode</Switch.Label>
				<Switch.Description class={style.switch__description}>
					Disable all network connections.
				</Switch.Description>
			</div>
			<Switch.Input class={style.switch__input} />
			<Switch.Control class={style.switch__control}>
				<Switch.Thumb class={style.switch__thumb} />
			</Switch.Control>
		</Switch>
	);
}

export function ErrorMessageExample() {
	const [checked, setChecked] = createSignal(false);

	return (
		<Switch
			class={style.switch}
			checked={checked()}
			onChange={setChecked}
			validationState={!checked() ? "invalid" : "valid"}
		>
			<div class="flex flex-col items-start mr-2">
				<Switch.Label class={style.switch__label}>Airplane mode</Switch.Label>
				<Switch.ErrorMessage class={style["switch__error-message"]}>
					You must enable airplane mode.
				</Switch.ErrorMessage>
			</div>
			<Switch.Input class={style.switch__input} />
			<Switch.Control class={style.switch__control}>
				<Switch.Thumb class={style.switch__thumb} />
			</Switch.Control>
		</Switch>
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
			<Switch class={style.switch} name="airplane-mode" value="on">
				<Switch.Label class={style.switch__label}>Airplane mode</Switch.Label>
				<Switch.Input class={style.switch__input} />
				<Switch.Control class={style.switch__control}>
					<Switch.Thumb class={style.switch__thumb} />
				</Switch.Control>
			</Switch>
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
