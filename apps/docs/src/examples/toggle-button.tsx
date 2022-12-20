import { ToggleButton as ToggleButtonBase } from "@kobalte/core";
import { ComponentProps, createSignal, JSX, Show, splitProps } from "solid-js";
import { Checkbox } from "./checkbox";
import { VolumeOffIcon, VolumeOnIcon } from "../components";

type ToggleButtonBaseProps = ComponentProps<typeof ToggleButtonBase>;

interface ToggleButtonProps extends Omit<ToggleButtonBaseProps, "children"> {
  onIcon: JSX.Element;
  offIcon: JSX.Element;
}

export function ToggleButton(props: ToggleButtonProps) {
  const [local, others] = splitProps(props, ["onIcon", "offIcon"]);

  return (
    <ToggleButtonBase
      class="appearance-none outline-none h-10 w-10 flex items-center justify-center rounded-md text-white bg-blue-600 dark:text-white/90 ui-disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30 ui-pressed:bg-red-600"
      {...others}
    >
      {state => (
        <Show when={state.isPressed()} fallback={local.offIcon}>
          {local.onIcon}
        </Show>
      )}
    </ToggleButtonBase>
  );
}

export function ControlledExample() {
  const [pressed, setPressed] = createSignal(false);

  return (
    <>
      <ToggleButton
        isPressed={pressed()}
        onPressedChange={setPressed}
        aria-label="Mute"
        onIcon={<VolumeOffIcon class="h-6 w-6" />}
        offIcon={<VolumeOnIcon class="h-6 w-6" />}
      />
      <p class="not-prose text-sm mt-2">The microphone is {pressed() ? "muted" : "active"}.</p>
    </>
  );
}
