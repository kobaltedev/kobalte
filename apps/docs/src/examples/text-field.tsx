import { TextField } from "@kobalte/core";
import { createSignal } from "solid-js";

import style from "./text-field.module.css";

export function BasicExample() {
  return (
    <TextField.Root class={style["text-field"]}>
      <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
      <TextField.Input class={style["text-field__input"]} />
    </TextField.Root>
  );
}

export function DefaultValueExample() {
  return (
    <TextField.Root class={style["text-field"]} defaultValue="Apple">
      <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
      <TextField.Input class={style["text-field__input"]} />
    </TextField.Root>
  );
}

export function ControlledExample() {
  const [value, setValue] = createSignal("Apple");

  return (
    <>
      <TextField.Root class={style["text-field"]} value={value()} onChange={setValue}>
        <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
        <TextField.Input class={style["text-field__input"]} />
      </TextField.Root>
      <p class="not-prose text-sm mt-4">Your favorite fruit is: {value()}.</p>
    </>
  );
}

export function TextAreaExample() {
  return (
    <TextField.Root class={style["text-field"]}>
      <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
      <TextField.TextArea class={style["text-field__input"]} />
    </TextField.Root>
  );
}

export function TextAreaAutoResizeExample() {
  return (
    <TextField.Root class={style["text-field"]}>
      <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
      <TextField.TextArea autoResize class={style["text-field__input"]} />
    </TextField.Root>
  );
}

export function DescriptionExample() {
  return (
    <TextField.Root class={style["text-field"]}>
      <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
      <TextField.Input class={style["text-field__input"]} />
      <TextField.Description class={style["text-field__description"]}>
        Choose the fruit you like the most.
      </TextField.Description>
    </TextField.Root>
  );
}

export function ErrorMessageExample() {
  const [value, setValue] = createSignal("Orange");

  return (
    <TextField.Root
      class={style["text-field"]}
      value={value()}
      onChange={setValue}
      validationState={value() !== "Apple" ? "invalid" : "valid"}
    >
      <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
      <TextField.Input class={style["text-field__input"]} />
      <TextField.ErrorMessage class={style["text-field__error-message"]}>
        Hmm, I prefer apples.
      </TextField.ErrorMessage>
    </TextField.Root>
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
      <TextField.Root class={style["text-field"]} name="favorite-fruit">
        <TextField.Label class={style["text-field__label"]}>Favorite fruit</TextField.Label>
        <TextField.Input class={style["text-field__input"]} />
      </TextField.Root>
      <div class="flex space-x-2">
        <button type="reset" class="kb-button">
          Reset
        </button>
        <button class="kb-button-primary">Submit</button>
      </div>
    </form>
  );
}
