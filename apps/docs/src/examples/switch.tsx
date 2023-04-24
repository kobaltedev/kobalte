import { Switch } from "@kobalte/core";
import { createSignal } from "solid-js";

import style from "./switch.module.css";

export function BasicExample() {
  return (
    <Switch.Root class={style["switch"]}>
      <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
      <Switch.Input class={style["switch__input"]} />
      <Switch.Control class={style["switch__control"]}>
        <Switch.Thumb class={style["switch__thumb"]} />
      </Switch.Control>
    </Switch.Root>
  );
}

export function DefaultCheckedExample() {
  return (
    <Switch.Root class={style["switch"]} defaultChecked>
      <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
      <Switch.Input class={style["switch__input"]} />
      <Switch.Control class={style["switch__control"]}>
        <Switch.Thumb class={style["switch__thumb"]} />
      </Switch.Control>
    </Switch.Root>
  );
}

export function ControlledExample() {
  const [checked, setChecked] = createSignal(false);

  return (
    <>
      <Switch.Root class={style["switch"]} checked={checked()} onChange={setChecked}>
        <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
        <Switch.Input class={style["switch__input"]} />
        <Switch.Control class={style["switch__control"]}>
          <Switch.Thumb class={style["switch__thumb"]} />
        </Switch.Control>
      </Switch.Root>
      <p class="not-prose text-sm mt-2">Airplane mode is {checked() ? "active" : "inactive"}.</p>
    </>
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
      <Switch.Root class={style["switch"]} name="airplane-mode" value="on">
        <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
        <Switch.Input class={style["switch__input"]} />
        <Switch.Control class={style["switch__control"]}>
          <Switch.Thumb class={style["switch__thumb"]} />
        </Switch.Control>
      </Switch.Root>
      <div class="flex space-x-2">
        <button type="reset" class="kb-button">
          Reset
        </button>
        <button class="kb-button-primary">Submit</button>
      </div>
    </form>
  );
}
