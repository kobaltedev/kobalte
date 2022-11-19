import { Button, ButtonProps, useColorMode } from "@kobalte/elements";
import { Show } from "solid-js";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeSelector(props: ButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      aria-label="toggle color mode"
      onPress={toggleColorMode}
      class="flex p-1 items-center justify-center transition rounded text-zinc-700 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
      {...props}
    >
      <Show when={colorMode() === "dark"} fallback={<MoonIcon class="h-5 w-5" />}>
        <SunIcon class="h-5 w-5" />
      </Show>
    </Button>
  );
}
