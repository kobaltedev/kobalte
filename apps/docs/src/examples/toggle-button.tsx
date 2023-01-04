import { ToggleButton } from "@kobalte/core";
import { createSignal, Show } from "solid-js";

import { VolumeOffIcon, VolumeOnIcon } from "../components";
import style from "./toggle-button.module.css";

export function BasicExample() {
  return (
    <ToggleButton class={style["toggle-button"]} aria-label="Mute">
      {state => (
        <Show when={state.isPressed()} fallback={<VolumeOnIcon class="h-6 w-6" />}>
          <VolumeOffIcon class="h-6 w-6" />
        </Show>
      )}
    </ToggleButton>
  );
}

export function DefaultPressedExample() {
  return (
    <ToggleButton class={style["toggle-button"]} aria-label="Mute" defaultIsPressed>
      {state => (
        <Show when={state.isPressed()} fallback={<VolumeOnIcon class="h-6 w-6" />}>
          <VolumeOffIcon class="h-6 w-6" />
        </Show>
      )}
    </ToggleButton>
  );
}

export function ControlledExample() {
  const [pressed, setPressed] = createSignal(false);

  return (
    <>
      <ToggleButton
        class={style["toggle-button"]}
        aria-label="Mute"
        isPressed={pressed()}
        onPressedChange={setPressed}
      >
        {state => (
          <Show when={state.isPressed()} fallback={<VolumeOnIcon class="h-6 w-6" />}>
            <VolumeOffIcon class="h-6 w-6" />
          </Show>
        )}
      </ToggleButton>
      <p class="not-prose text-sm mt-2">The microphone is {pressed() ? "muted" : "active"}.</p>
    </>
  );
}
