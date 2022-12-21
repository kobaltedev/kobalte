import { Button } from "@kobalte/core";
import { createSignal, Show } from "solid-js";

import style from "./button.module.css";

export function BasicExample() {
  return <Button class={style["button"]}>Press me</Button>;
}

export function EventsExample() {
  const [pointerType, setPointerType] = createSignal<string>();

  return (
    <Button
      class={style["button"]}
      onPressStart={e => setPointerType(e.pointerType)}
      onPressEnd={() => setPointerType(undefined)}
    >
      <Show when={pointerType()} fallback="Press me">
        You are pressing the button with a {pointerType()}!
      </Show>
    </Button>
  );
}

export function DisabledExample() {
  return (
    <Button class={style["button"]} isDisabled>
      Press me
    </Button>
  );
}
