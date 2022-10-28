import { IconButton, useColorMode } from "@kobalte/core";
import { ComponentProps, Show } from "solid-js";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeSelector(props: Omit<ComponentProps<typeof IconButton>, "aria-label">) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      variant="plain"
      colorScheme="neutral"
      size="sm"
      aria-label="toggle color mode"
      onClick={toggleColorMode}
      {...props}
    >
      <Show when={colorMode() === "dark"} fallback={<MoonIcon boxSize={5} />}>
        <SunIcon boxSize={5} />
      </Show>
    </IconButton>
  );
}
