import { ToggleButton } from "@kobalte/core";
import { Show } from "solid-js";

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
