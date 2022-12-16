import { ConfigColorMode, Select, SelectProps, useColorMode } from "@kobalte/elements";
import { Show } from "solid-js";

import { DesktopIcon, MoonIcon, SunIcon } from "./icons";

const COLOR_MODE_OPTIONS = [
  { value: "light", label: "Light", icon: () => <SunIcon class="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: () => <MoonIcon class="h-4 w-4" /> },
  { value: "system", label: "System", icon: () => <DesktopIcon class="h-4 w-4" /> },
];

export function ThemeSelector(props: Omit<SelectProps, "options">) {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <Select
      options={COLOR_MODE_OPTIONS}
      defaultValue={colorMode()}
      onValueChange={value => setColorMode(value as ConfigColorMode)}
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
          <Select.Menu class="bg-white border border-zinc-300 rounded shadow-md py-1 z-50 dark:text-zinc-300 dark:bg-zinc-800 dark:border-none dark:shadow-none">
            {node => (
              <Select.Option
                node={node()}
                class="flex items-center space-x-2 px-3 py-1 text-sm outline-none ui-selected:text-sky-700 ui-focus:bg-zinc-100 transition-colors cursor-default dark:ui-selected:text-sky-400 dark:ui-focus:bg-zinc-700"
              >
                <span>{node().rawValue.icon}</span>
                <Select.OptionLabel>{node().label}</Select.OptionLabel>
              </Select.Option>
            )}
          </Select.Menu>
        </Select.Positioner>
      </Select.Portal>
    </Select>
  );
}
