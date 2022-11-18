import { Button, ButtonProps, useColorMode } from "@kobalte/elements";
import { Show } from "solid-js";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeSelector(props: ButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      aria-label="toggle color mode"
      onPress={toggleColorMode}
      class="cursor-default flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600"
      {...props}
    >
      <Show when={colorMode() === "dark"} fallback={<MoonIcon class="h-5 w-5" />}>
        <SunIcon class="h-5 w-5" />
      </Show>
    </Button>
  );
}
