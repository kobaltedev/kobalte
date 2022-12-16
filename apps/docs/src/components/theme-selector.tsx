import {
  CollectionKey,
  ConfigColorMode,
  Select,
  SelectProps,
  useColorMode,
} from "@kobalte/elements";
import { Show } from "solid-js";

import { DesktopIcon, MoonIcon, SunIcon } from "./icons";

const COLOR_MODE_OPTIONS = [
  { value: "light", label: "Light", icon: () => <SunIcon class="h-5 w-5" /> },
  { value: "dark", label: "Dark", icon: () => <MoonIcon class="h-5 w-5" /> },
  { value: "system", label: "System", icon: () => <DesktopIcon class="h-5 w-5" /> },
];

export function ThemeSelector(props: Omit<SelectProps, "options">) {
  const { colorMode, setColorMode } = useColorMode();

  const onValueChange = (newValue: Set<CollectionKey>) => {
    setColorMode(newValue.values().next().value);
  };

  return (
    <Select
      options={COLOR_MODE_OPTIONS}
      defaultValue={colorMode()}
      onValueChange={onValueChange}
      gutter={8}
      sameWidth={false}
      placement="bottom"
      {...props}
    >
      <Select.Trigger
        aria-label="toggle color mode"
        class="flex p-1 items-center justify-center transition rounded text-zinc-700 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <Show when={colorMode() === "dark"} fallback={<SunIcon class="h-5 w-5" />}>
          <MoonIcon class="h-5 w-5" />
        </Show>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Menu class="bg-white border border-zinc-300 rounded py-1 z-50">
            {node => (
              <Select.Option node={node()} class="flex items-center space-x-2 px-3 py-2">
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
