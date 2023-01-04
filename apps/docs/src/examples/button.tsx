import { Button } from "@kobalte/core";
import { createSignal, Show } from "solid-js";

import style from "./button.module.css";

export function BasicExample() {
  return <Button class={style["button"]}>Press me</Button>;
}

export function PressInteractionExample() {
  const [pointerType, setPointerType] = createSignal<string>();

  return (
    <>
      <Button
        class={style["button"]}
        onPressStart={e => setPointerType(e.pointerType)}
        onPressEnd={() => setPointerType(undefined)}
      >
        Press me
      </Button>
      <p class="not-prose text-sm mt-2">
        <Show when={pointerType()} fallback="Ready to be pressed.">
          You are pressing the button with a {pointerType()}!
        </Show>
      </p>
    </>
  );
}
