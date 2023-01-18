import { ConfigColorMode, Select, useColorMode } from "@kobalte/core";
import { clsx } from "clsx";
import { ComponentProps, Show, splitProps } from "solid-js";

import { DesktopIcon, MoonIcon, SunIcon } from "./icons";

function Item(props: ComponentProps<typeof Select.Item>) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <Select.Item
      class={clsx(
        "flex items-center space-x-2 px-3 py-1 text-sm outline-none ui-selected:text-sky-700 ui-focus:bg-zinc-100 transition-colors cursor-default dark:ui-selected:text-sky-400 dark:ui-focus:bg-zinc-700",
        local.class
      )}
      {...others}
    />
  );
}

export function ThemeSelector(props: ComponentProps<typeof Select.Root>) {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Select.Root
      defaultValue={colorMode()}
      onValueChange={value => setColorMode(value as ConfigColorMode)}
      gutter={8}
      sameWidth={false}
      placement="bottom"
      {...props}
    >
      <Select.Trigger
        aria-label="toggle color mode"
        class="flex p-4 items-center justify-center transition rounded text-zinc-700 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <Select.Value>
          <Show when={colorMode() === "dark"} fallback={<SunIcon class="h-5 w-5" />}>
            <MoonIcon class="h-5 w-5" />
          </Show>
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="bg-white border border-zinc-300 rounded shadow-md py-1 z-50 dark:text-zinc-300 dark:bg-zinc-800 dark:border-none dark:shadow-none">
          <Select.Listbox>
            <Item value="light">
              <SunIcon class="h-4 w-4" />
              <Select.ItemLabel>Light</Select.ItemLabel>
            </Item>
            <Item value="dark">
              <MoonIcon class="h-4 w-4" />
              <Select.ItemLabel>Dark</Select.ItemLabel>
            </Item>
            <Item value="system">
              <DesktopIcon class="h-4 w-4" />
              <Select.ItemLabel>System</Select.ItemLabel>
            </Item>
          </Select.Listbox>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
