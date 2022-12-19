import { Popover } from "@kobalte/core";

export const PopoverDemo = () => (
  <Popover>
    <Popover.Trigger class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30">
      Learn more
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Content class="z-10 outline-none w-72 p-4 shadow-md border border-zinc-200 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <Popover.Arrow />
          <p>
            Kobalte is a UI toolkit for building accessible web apps and design systems with
            SolidJS.
          </p>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover>
);
