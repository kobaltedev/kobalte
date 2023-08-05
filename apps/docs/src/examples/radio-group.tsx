import { RadioGroup } from "@kobalte/core";
import { createSignal, For } from "solid-js";

import style from "./radio-group.module.css";

export function BasicExample() {
  return (
    <RadioGroup.Root class={style["radio-group"]}>
      <RadioGroup.Label class={style["radio-group__label"]}>Favorite fruit</RadioGroup.Label>
      <div class={style["radio-group__items"]}>
        <For each={["Apple", "Orange", "Watermelon"]}>
          {fruit => (
            <RadioGroup.Item value={fruit} class={style["radio"]}>
              <RadioGroup.ItemInput class={style["radio__input"]} />
              <RadioGroup.ItemControl class={style["radio__control"]}>
                <RadioGroup.ItemIndicator class={style["radio__indicator"]} />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel class={style["radio__label"]}>{fruit}</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          )}
        </For>
      </div>
    </RadioGroup.Root>
  );
}

export function DefaultValueExample() {
  return (
    <RadioGroup.Root class={style["radio-group"]} defaultValue="Orange">
      <RadioGroup.Label class={style["radio-group__label"]}>Favorite fruit</RadioGroup.Label>
      <div class={style["radio-group__items"]}>
        <For each={["Apple", "Orange", "Watermelon"]}>
          {fruit => (
            <RadioGroup.Item value={fruit} class={style["radio"]}>
              <RadioGroup.ItemInput class={style["radio__input"]} />
              <RadioGroup.ItemControl class={style["radio__control"]}>
                <RadioGroup.ItemIndicator class={style["radio__indicator"]} />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel class={style["radio__label"]}>{fruit}</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          )}
        </For>
      </div>
    </RadioGroup.Root>
  );
}

export function ControlledExample() {
  const [value, setValue] = createSignal("Orange");

  return (
    <>
      <RadioGroup.Root class={style["radio-group"]} value={value()} onChange={setValue}>
        <RadioGroup.Label class={style["radio-group__label"]}>Favorite fruit</RadioGroup.Label>
        <div class={style["radio-group__items"]}>
          <For each={["Apple", "Orange", "Watermelon"]}>
            {fruit => (
              <RadioGroup.Item value={fruit} class={style["radio"]}>
                <RadioGroup.ItemInput class={style["radio__input"]} />
                <RadioGroup.ItemControl class={style["radio__control"]}>
                  <RadioGroup.ItemIndicator class={style["radio__indicator"]} />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemLabel class={style["radio__label"]}>{fruit}</RadioGroup.ItemLabel>
              </RadioGroup.Item>
            )}
          </For>
        </div>
      </RadioGroup.Root>
      <p class="not-prose text-sm mt-4">Your favorite fruit is: {value()}.</p>
    </>
  );
}

export function DescriptionExample() {
  return (
    <RadioGroup.Root class={style["radio-group"]}>
      <RadioGroup.Label class={style["radio-group__label"]}>Favorite fruit</RadioGroup.Label>
      <div class={style["radio-group__items"]}>
        <For each={["Apple", "Orange", "Watermelon"]}>
          {fruit => (
            <RadioGroup.Item value={fruit} class={style["radio"]}>
              <RadioGroup.ItemInput class={style["radio__input"]} />
              <RadioGroup.ItemControl class={style["radio__control"]}>
                <RadioGroup.ItemIndicator class={style["radio__indicator"]} />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel class={style["radio__label"]}>{fruit}</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          )}
        </For>
      </div>
      <RadioGroup.Description class={style["radio-group__description"]}>
        Choose the fruit you like the most.
      </RadioGroup.Description>
    </RadioGroup.Root>
  );
}

export function ErrorMessageExample() {
  const [value, setValue] = createSignal("Orange");

  return (
    <RadioGroup.Root
      class={style["radio-group"]}
      value={value()}
      onChange={setValue}
      validationState={value() !== "Apple" ? "invalid" : "valid"}
    >
      <RadioGroup.Label class={style["radio-group__label"]}>Favorite fruit</RadioGroup.Label>
      <div class={style["radio-group__items"]}>
        <For each={["Apple", "Orange", "Watermelon"]}>
          {fruit => (
            <RadioGroup.Item value={fruit} class={style["radio"]}>
              <RadioGroup.ItemInput class={style["radio__input"]} />
              <RadioGroup.ItemControl class={style["radio__control"]}>
                <RadioGroup.ItemIndicator class={style["radio__indicator"]} />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemLabel class={style["radio__label"]}>{fruit}</RadioGroup.ItemLabel>
            </RadioGroup.Item>
          )}
        </For>
      </div>
      <RadioGroup.ErrorMessage class={style["radio-group__error-message"]}>
        Hmm, I prefer apples.
      </RadioGroup.ErrorMessage>
    </RadioGroup.Root>
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
    <form ref={formRef} onSubmit={onSubmit} class="flex flex-col items-center space-y-6">
      <RadioGroup.Root class={style["radio-group"]} name="favorite-fruit">
        <RadioGroup.Label class={style["radio-group__label"]}>Favorite fruit</RadioGroup.Label>
        <div class={style["radio-group__items"]}>
          <For each={["Apple", "Orange", "Watermelon"]}>
            {fruit => (
              <RadioGroup.Item value={fruit} class={style["radio"]}>
                <RadioGroup.ItemInput class={style["radio__input"]} />
                <RadioGroup.ItemControl class={style["radio__control"]}>
                  <RadioGroup.ItemIndicator class={style["radio__indicator"]} />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemLabel class={style["radio__label"]}>{fruit}</RadioGroup.ItemLabel>
              </RadioGroup.Item>
            )}
          </For>
        </div>
      </RadioGroup.Root>
      <div class="flex space-x-2">
        <button type="reset" class="kb-button">
          Reset
        </button>
        <button class="kb-button-primary">Submit</button>
      </div>
    </form>
  );
}
