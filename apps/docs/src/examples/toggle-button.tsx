import { ToggleButton } from "@kobalte/core";
import { createSignal, Show } from "solid-js";

import { VolumeOffIcon, VolumeOnIcon } from "../components";
import style from "./toggle-button.module.css";

export function BasicExample() {
  return (
    <ToggleButton.Root class={style["toggle-button"]} aria-label="Mute">
      {state => (
        <Show when={state.pressed()} fallback={<VolumeOnIcon class="h-6 w-6" />}>
          <VolumeOffIcon class="h-6 w-6" />
        </Show>
      )}
    </ToggleButton.Root>
  );
}

export function DefaultPressedExample() {
  return (
    <ToggleButton.Root class={style["toggle-button"]} aria-label="Mute" defaultPressed>
      {state => (
        <Show when={state.pressed()} fallback={<VolumeOnIcon class="h-6 w-6" />}>
          <VolumeOffIcon class="h-6 w-6" />
        </Show>
      )}
    </ToggleButton.Root>
  );
}

export function ControlledExample() {
  const [pressed, setPressed] = createSignal(false);

  return (
    <>
      <ToggleButton.Root
        class={style["toggle-button"]}
        aria-label="Mute"
        pressed={pressed()}
        onChange={setPressed}
      >
        {state => (
          <Show when={state.pressed()} fallback={<VolumeOnIcon class="h-6 w-6" />}>
            <VolumeOffIcon class="h-6 w-6" />
          </Show>
        )}
      </ToggleButton.Root>
      <p class="not-prose text-sm mt-2">The microphone is {pressed() ? "muted" : "active"}.</p>
    </>
  );
}
