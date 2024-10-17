import { createSignal, For } from "solid-js";
import { CheckboxGroup } from "../src";
import style from "./App.module.css";

export default function App() {
	const [value, setValue] = createSignal(["cats"]);

	return (
		<CheckboxGroup.Root
				class={style["checkbox-group"]}
				values={value()}
				onChange={setValue}
			>
				<CheckboxGroup.Label class={style["checkbox-group__label"]}>
					Favorite fruit
				</CheckboxGroup.Label>
				<div class={style["checkbox-group__items"]} role="presentation">
					<For each={["Apple", "Orange", "Watermelon"]}>
						{(fruit) => (
							<CheckboxGroup.Item value={fruit} class={style.checkbox}>
								<CheckboxGroup.ItemInput class={style.checkbox__input} />
								<CheckboxGroup.ItemControl class={style.checkbox__control}>
									<CheckboxGroup.ItemIndicator class={style.checkbox__indicator} />
								</CheckboxGroup.ItemControl>
								<CheckboxGroup.ItemLabel class={style.checkbox__label}>
									{fruit}
								</CheckboxGroup.ItemLabel>
							</CheckboxGroup.Item>
						)}
					</For>
				</div>
			</CheckboxGroup.Root>
	);
}
