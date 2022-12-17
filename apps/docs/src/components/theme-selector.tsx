import { ConfigColorMode, Select, SelectProps, useColorMode } from "@kobalte/elements";
import { clsx } from "clsx";
import { ComponentProps, Show, splitProps } from "solid-js";

import { DesktopIcon, MoonIcon, SunIcon } from "./icons";

function Option(props: ComponentProps<typeof Select.Option>) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <Select.Option
      class={clsx(
        "flex items-center space-x-2 px-3 py-1 text-sm outline-none ui-selected:text-sky-700 ui-focus:bg-zinc-100 transition-colors cursor-default dark:ui-selected:text-sky-400 dark:ui-focus:bg-zinc-700",
        local.class
      )}
      {...others}
    />
  );
}

export function ThemeSelector(props: Omit<SelectProps, "options">) {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Select
      defaultValue={colorMode()}
      onValueChange={value => setColorMode(value.values().next().value as ConfigColorMode)}
      gutter={8}
      sameWidth={false}
      placement="bottom"
      {...props}
    >
      <Select.Trigger
        aria-label="toggle color mode"
        class="flex p-1 items-center justify-center transition rounded text-zinc-700 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <Select.Value>
          <Show when={colorMode() === "dark"} fallback={<SunIcon class="h-5 w-5" />}>
            <MoonIcon class="h-5 w-5" />
          </Show>
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Panel class="bg-white border border-zinc-300 rounded shadow-md py-1 z-50 dark:text-zinc-300 dark:bg-zinc-800 dark:border-none dark:shadow-none">
            <Select.Listbox>
              <Option value="light">
                <SunIcon class="h-4 w-4" />
                <Select.OptionLabel>Light</Select.OptionLabel>
              </Option>
              <Option value="dark">
                <MoonIcon class="h-4 w-4" />
                <Select.OptionLabel>Dark</Select.OptionLabel>
              </Option>
              <Option value="system">
                <DesktopIcon class="h-4 w-4" />
                <Select.OptionLabel>System</Select.OptionLabel>
              </Option>
            </Select.Listbox>
          </Select.Panel>
        </Select.Positioner>
      </Select.Portal>
    </Select>
  );
}
