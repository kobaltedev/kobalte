import { Checkbox } from "@kobalte/core";
import { clsx } from "clsx";
import { createSignal } from "solid-js";

import { CheckIcon } from "../components";
import style from "./checkbox.module.css";

export function BasicExample() {
  return (
    <Checkbox.Root class={style["checkbox"]}>
      <Checkbox.Input class={style["checkbox__input"]} />
      <Checkbox.Control class={style["checkbox__control"]}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label class={style["checkbox__label"]}>Subscribe</Checkbox.Label>
    </Checkbox.Root>
  );
}

export function DefaultCheckedExample() {
  return (
    <Checkbox.Root class={style["checkbox"]} defaultChecked>
      <Checkbox.Input class={style["checkbox__input"]} />
      <Checkbox.Control class={style["checkbox__control"]}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label class={style["checkbox__label"]}>Subscribe</Checkbox.Label>
    </Checkbox.Root>
  );
}

export function ControlledExample() {
  const [checked, setChecked] = createSignal(false);

  return (
    <>
      <Checkbox.Root class={style["checkbox"]} checked={checked()} onChange={setChecked}>
        <Checkbox.Input class={style["checkbox__input"]} />
        <Checkbox.Control class={style["checkbox__control"]}>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class={style["checkbox__label"]}>Subscribe</Checkbox.Label>
      </Checkbox.Root>
      <p class="not-prose text-sm mt-2">You are {checked() ? "subscribed" : "unsubscribed"}.</p>
    </>
  );
}

export function DescriptionExample() {
  return (
    <Checkbox.Root class={clsx(style["checkbox"], "!items-start")}>
      <Checkbox.Input class={style["checkbox__input"]} />
      <Checkbox.Control class={style["checkbox__control"]}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <div class="flex flex-col items-start -mt-0.5">
        <Checkbox.Label class={style["checkbox__label"]}>Subscribe</Checkbox.Label>
        <Checkbox.Description class={style["checkbox__description"]}>
          You will receive our weekly newsletter.
        </Checkbox.Description>
      </div>
    </Checkbox.Root>
  );
}

export function ErrorMessageExample() {
  const [checked, setChecked] = createSignal(false);

  return (
    <Checkbox.Root
      class={clsx(style["checkbox"], "!items-start")}
      checked={checked()}
      onChange={setChecked}
      validationState={!checked() ? "invalid" : "valid"}
    >
      <Checkbox.Input class={style["checkbox__input"]} />
      <Checkbox.Control class={style["checkbox__control"]}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <div class="flex flex-col items-start -mt-0.5">
        <Checkbox.Label class={style["checkbox__label"]}>Subscribe</Checkbox.Label>
        <Checkbox.ErrorMessage class={style["checkbox__error-message"]}>
          You must agree to our Terms and Conditions.
        </Checkbox.ErrorMessage>
      </div>
    </Checkbox.Root>
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
      <Checkbox.Root class={style["checkbox"]} name="newsletter" value="subscribe">
        <Checkbox.Input class={style["checkbox__input"]} />
        <Checkbox.Control class={style["checkbox__control"]}>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class={style["checkbox__label"]}>Subscribe</Checkbox.Label>
      </Checkbox.Root>
      <div class="flex space-x-2">
        <button type="reset" class="kb-button">
          Reset
        </button>
        <button class="kb-button-primary">Submit</button>
      </div>
    </form>
  );
}
