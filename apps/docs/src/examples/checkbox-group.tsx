import { CheckboxGroup } from "@kobalte/core/checkbox-group";
import { For, createEffect, createSignal } from "solid-js";

import { CheckIcon } from "../components";
import style from "./checkbox-group.module.css";

export function BasicExample() {
	return (
		<CheckboxGroup class={style["checkbox-group"]}>
			<CheckboxGroup.Label class={style["checkbox-group__label"]}>
				Subscribe to topics
			</CheckboxGroup.Label>
			<div class={style["checkbox-group__items"]} role="presentation">
				<For each={["News", "Updates", "Offers"]}>
					{(topic) => (
						<CheckboxGroup.Item value={topic} class={style.checkbox}>
							<CheckboxGroup.ItemInput class={style.checkbox__input} />
							<CheckboxGroup.ItemControl class={style.checkbox__control}>
								<CheckboxGroup.ItemIndicator>
									<CheckIcon />
								</CheckboxGroup.ItemIndicator>
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel class={style.checkbox__label}>
								{topic}
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					)}
				</For>
			</div>
		</CheckboxGroup>
	);
}

export function DefaultValueExample() {
	return (
		<CheckboxGroup
			class={style["checkbox-group"]}
			defaultValues={[{ id: "News", value: "News" }]}
		>
			<CheckboxGroup.Label class={style["checkbox-group__label"]}>
				Subscribe to topics
			</CheckboxGroup.Label>
			<div class={style["checkbox-group__items"]} role="presentation">
				<For each={["News", "Updates", "Offers"]}>
					{(topic) => (
						<CheckboxGroup.Item id={topic} value={topic} class={style.checkbox}>
							<CheckboxGroup.ItemInput class={style.checkbox__input} />
							<CheckboxGroup.ItemControl class={style.checkbox__control}>
								<CheckboxGroup.ItemIndicator>
									<CheckIcon />
								</CheckboxGroup.ItemIndicator>
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel class={style.checkbox__label}>
								{topic}
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					)}
				</For>
			</div>
		</CheckboxGroup>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal([{ id: "News", value: "News" }]);

	return (
		<>
			<CheckboxGroup
				class={style["checkbox-group"]}
				values={value()}
				onChange={setValue}
			>
				<CheckboxGroup.Label class={style["checkbox-group__label"]}>
					What would you like to subscribe to?
				</CheckboxGroup.Label>
				<div class={style["checkbox-group__items"]} role="presentation">
					<For each={["News", "Updates", "Offers"]}>
						{(option) => (
							<CheckboxGroup.Item
								id={option}
								value={option}
								class={style.checkbox}
							>
								<CheckboxGroup.ItemInput class={style.checkbox__input} />
								<CheckboxGroup.ItemControl class={style.checkbox__control}>
									<CheckboxGroup.ItemIndicator>
										<CheckIcon />
									</CheckboxGroup.ItemIndicator>
								</CheckboxGroup.ItemControl>
								<CheckboxGroup.ItemLabel class={style.checkbox__label}>
									{option}
								</CheckboxGroup.ItemLabel>
							</CheckboxGroup.Item>
						)}
					</For>
				</div>
			</CheckboxGroup>
		</>
	);
}

export function DescriptionExample() {
	return (
		<CheckboxGroup class={style["checkbox-group"]}>
			<CheckboxGroup.Label class={style["checkbox-group__label"]}>
				What would you like to subscribe to?
			</CheckboxGroup.Label>
			<div class={style["checkbox-group__items"]} role="presentation">
				<For each={["News", "Updates", "Offers"]}>
					{(option) => (
						<CheckboxGroup.Item value={option} class={style.checkbox}>
							<CheckboxGroup.ItemInput class={style.checkbox__input} />
							<CheckboxGroup.ItemControl class={style.checkbox__control}>
								<CheckboxGroup.ItemIndicator>
									<CheckIcon />
								</CheckboxGroup.ItemIndicator>
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel class={style.checkbox__label}>
								{option}
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					)}
				</For>
			</div>
			<CheckboxGroup.Description class={style["checkbox-group__description"]}>
				Select the types of updates you'd like to receive.
			</CheckboxGroup.Description>
		</CheckboxGroup>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal([{ id: "News", value: "News" }]);

	return (
		<CheckboxGroup
			class={style["checkbox-group"]}
			values={value()}
			onChange={setValue}
			validationState={
				!value().some((val) => val.id === "News" && val.value === "News")
					? "invalid"
					: "valid"
			}
		>
			<CheckboxGroup.Label class={style["checkbox-group__label"]}>
				What would you like to subscribe to?
			</CheckboxGroup.Label>
			<div class={style["checkbox-group__items"]} role="presentation">
				<For each={["News", "Updates", "Offers"]}>
					{(option) => (
						<CheckboxGroup.Item
							id={option}
							value={option}
							class={style.checkbox}
						>
							<CheckboxGroup.ItemInput class={style.checkbox__input} />
							<CheckboxGroup.ItemControl class={style.checkbox__control}>
								<CheckboxGroup.ItemIndicator>
									<CheckIcon />
								</CheckboxGroup.ItemIndicator>
							</CheckboxGroup.ItemControl>
							<CheckboxGroup.ItemLabel class={style.checkbox__label}>
								{option}
							</CheckboxGroup.ItemLabel>
						</CheckboxGroup.Item>
					)}
				</For>
			</div>
			<CheckboxGroup.ErrorMessage
				class={style["checkbox-group__error-message"]}
			>
				Please select News to stay informed.
			</CheckboxGroup.ErrorMessage>
		</CheckboxGroup>
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
			<CheckboxGroup class={style["checkbox-group"]} name="subscriptions">
				<CheckboxGroup.Label class={style["checkbox-group__label"]}>
					What would you like to subscribe to?
				</CheckboxGroup.Label>
				<div class={style["checkbox-group__items"]} role="presentation">
					<For each={["News", "Updates", "Offers"]}>
						{(option) => (
							<CheckboxGroup.Item
								id={option}
								value={option}
								class={style.checkbox}
							>
								<CheckboxGroup.ItemInput class={style.checkbox__input} />
								<CheckboxGroup.ItemControl class={style.checkbox__control}>
									<CheckboxGroup.ItemIndicator>
										<CheckIcon />
									</CheckboxGroup.ItemIndicator>
								</CheckboxGroup.ItemControl>
								<CheckboxGroup.ItemLabel class={style.checkbox__label}>
									{option}
								</CheckboxGroup.ItemLabel>
							</CheckboxGroup.Item>
						)}
					</For>
				</div>
			</CheckboxGroup>
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
