import { SegmentedControl } from "@kobalte/core/segmented-control";
import { For, createSignal } from "solid-js";

import style from "./segmented-control.module.css";

export function BasicExample() {
	return (
		<SegmentedControl class={style["segmented-control"]} defaultValue="Apple">
			<SegmentedControl.Label class={style["segmented-control__label"]}>
				Favorite fruit
			</SegmentedControl.Label>
			<div class={style["segmented-control__wrapper"]} role="presentation">
				<SegmentedControl.Indicator
					class={style["segmented-control__indicator"]}
				/>
				<For each={["Apple", "Orange", "Watermelon"]}>
					{(fruit) => (
						<SegmentedControl.Item
							value={fruit}
							class={style["segmented-control__item"]}
						>
							<SegmentedControl.ItemInput
								class={style["segmented-control__item-input"]}
							/>
							<SegmentedControl.ItemLabel
								class={style["segmented-control__item-label"]}
							>
								{fruit}
							</SegmentedControl.ItemLabel>
						</SegmentedControl.Item>
					)}
				</For>
			</div>
		</SegmentedControl>
	);
}

export function VerticalExample() {
	return (
		<SegmentedControl
			class={style["segmented-control"]}
			defaultValue="Apple"
			orientation="vertical"
		>
			<SegmentedControl.Label class={style["segmented-control__label"]}>
				Favorite fruit
			</SegmentedControl.Label>
			<div class={style["segmented-control__wrapper"]} role="presentation">
				<SegmentedControl.Indicator
					class={style["segmented-control__indicator"]}
				/>
				<For each={["Apple", "Orange", "Watermelon"]}>
					{(fruit) => (
						<SegmentedControl.Item
							value={fruit}
							class={style["segmented-control__item"]}
						>
							<SegmentedControl.ItemInput
								class={style["segmented-control__item-input"]}
							/>
							<SegmentedControl.ItemLabel
								class={style["segmented-control__item-label"]}
							>
								{fruit}
							</SegmentedControl.ItemLabel>
						</SegmentedControl.Item>
					)}
				</For>
			</div>
		</SegmentedControl>
	);
}

export function ControlledExample() {
	const [value, setValue] = createSignal("Orange");

	return (
		<>
			<SegmentedControl
				class={style["segmented-control"]}
				value={value()}
				onChange={setValue}
			>
				<SegmentedControl.Label class={style["segmented-control__label"]}>
					Favorite fruit
				</SegmentedControl.Label>
				<div class={style["segmented-control__wrapper"]} role="presentation">
					<SegmentedControl.Indicator
						class={style["segmented-control__indicator"]}
					/>
					<For each={["Apple", "Orange", "Watermelon"]}>
						{(fruit) => (
							<SegmentedControl.Item
								value={fruit}
								class={style["segmented-control__item"]}
							>
								<SegmentedControl.ItemInput
									class={style["segmented-control__item-input"]}
								/>
								<SegmentedControl.ItemLabel
									class={style["segmented-control__item-label"]}
								>
									{fruit}
								</SegmentedControl.ItemLabel>
							</SegmentedControl.Item>
						)}
					</For>
				</div>
			</SegmentedControl>
			<p class="not-prose text-sm mt-4">Your favorite fruit is: {value()}.</p>
		</>
	);
}

export function DescriptionExample() {
	return (
		<SegmentedControl class={style["segmented-control"]} defaultValue="Apple">
			<SegmentedControl.Label class={style["segmented-control__label"]}>
				Favorite fruit
			</SegmentedControl.Label>
			<div class={style["segmented-control__wrapper"]} role="presentation">
				<SegmentedControl.Indicator
					class={style["segmented-control__indicator"]}
				/>
				<For each={["Apple", "Orange", "Watermelon"]}>
					{(fruit) => (
						<SegmentedControl.Item
							value={fruit}
							class={style["segmented-control__item"]}
						>
							<SegmentedControl.ItemInput
								class={style["segmented-control__item-input"]}
							/>
							<SegmentedControl.ItemLabel
								class={style["segmented-control__item-label"]}
							>
								{fruit}
							</SegmentedControl.ItemLabel>
						</SegmentedControl.Item>
					)}
				</For>
			</div>
			<SegmentedControl.Description
				class={style["segmented-control__description"]}
			>
				Choose the fruit you like the most.
			</SegmentedControl.Description>
		</SegmentedControl>
	);
}

export function ErrorMessageExample() {
	const [value, setValue] = createSignal("Orange");

	return (
		<SegmentedControl
			class={style["segmented-control"]}
			value={value()}
			onChange={setValue}
			validationState={value() !== "Apple" ? "invalid" : "valid"}
		>
			<SegmentedControl.Label class={style["segmented-control__label"]}>
				Favorite fruit
			</SegmentedControl.Label>
			<div class={style["segmented-control__wrapper"]} role="presentation">
				<SegmentedControl.Indicator
					class={style["segmented-control__indicator"]}
				/>
				<For each={["Apple", "Orange", "Watermelon"]}>
					{(fruit) => (
						<SegmentedControl.Item
							value={fruit}
							class={style["segmented-control__item"]}
						>
							<SegmentedControl.ItemInput
								class={style["segmented-control__item-input"]}
							/>
							<SegmentedControl.ItemLabel
								class={style["segmented-control__item-label"]}
							>
								{fruit}
							</SegmentedControl.ItemLabel>
						</SegmentedControl.Item>
					)}
				</For>
			</div>
			<SegmentedControl.ErrorMessage
				class={style["segmented-control__error-message"]}
			>
				Hmm, I prefer apples.
			</SegmentedControl.ErrorMessage>
		</SegmentedControl>
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
			<SegmentedControl
				class={style["segmented-control"]}
				name="favorite-fruit"
				defaultValue="Orange"
			>
				<SegmentedControl.Label class={style["segmented-control__label"]}>
					Favorite fruit
				</SegmentedControl.Label>
				<div class={style["segmented-control__wrapper"]} role="presentation">
					<SegmentedControl.Indicator
						class={style["segmented-control__indicator"]}
					/>
					<For each={["Apple", "Orange", "Watermelon"]}>
						{(fruit) => (
							<SegmentedControl.Item
								value={fruit}
								class={style["segmented-control__item"]}
							>
								<SegmentedControl.ItemInput
									class={style["segmented-control__item-input"]}
								/>
								<SegmentedControl.ItemLabel
									class={style["segmented-control__item-label"]}
								>
									{fruit}
								</SegmentedControl.ItemLabel>
							</SegmentedControl.Item>
						)}
					</For>
				</div>
			</SegmentedControl>
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
