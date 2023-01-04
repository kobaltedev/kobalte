import { Switch } from "@kobalte/core";
import { createSignal } from "solid-js";

import style from "./switch.module.css";

export function BasicExample() {
  return (
    <Switch class={style["switch"]}>
      <Switch.Input />
      <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
      <Switch.Control class={style["switch__control"]}>
        <Switch.Thumb class={style["switch__thumb"]} />
      </Switch.Control>
    </Switch>
  );
}

export function DefaultCheckedExample() {
  return (
    <Switch class={style["switch"]} defaultIsChecked>
      <Switch.Input />
      <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
      <Switch.Control class={style["switch__control"]}>
        <Switch.Thumb class={style["switch__thumb"]} />
      </Switch.Control>
    </Switch>
  );
}

export function ControlledExample() {
  const [checked, setChecked] = createSignal(false);

  return (
    <>
      <Switch class={style["switch"]} isChecked={checked()} onCheckedChange={setChecked}>
        <Switch.Input />
        <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
        <Switch.Control class={style["switch__control"]}>
          <Switch.Thumb class={style["switch__thumb"]} />
        </Switch.Control>
      </Switch>
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
      <Switch class={style["switch"]} name="airplane-mode" value="on">
        <Switch.Input />
        <Switch.Label class={style["switch__label"]}>Airplane mode</Switch.Label>
        <Switch.Control class={style["switch__control"]}>
          <Switch.Thumb class={style["switch__thumb"]} />
        </Switch.Control>
      </Switch>
      <div class="flex space-x-2">
        <button type="reset" class="kb-button">
          Reset
        </button>
        <button class="kb-button-primary">Submit</button>
      </div>
    </form>
  );
}
