import { Popover as PopoverBase } from "@kobalte/core";
import { ComponentProps, createSignal, splitProps } from "solid-js";

import { CrossIcon } from "../components";

function Popover(props: ComponentProps<typeof PopoverBase>) {
  return <PopoverBase {...props} />;
}

function PopoverTrigger(props: ComponentProps<typeof PopoverBase.Trigger>) {
  return (
    <PopoverBase.Trigger
      class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30"
      {...props}
    />
  );
}

function PopoverContent(props: ComponentProps<typeof PopoverBase.Content>) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <PopoverBase.Portal>
      <PopoverBase.Positioner>
        <PopoverBase.Content
          class="z-10 outline-none shadow-md border border-zinc-200 rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700"
          {...others}
        >
          <PopoverBase.Arrow />
          {local.children}
        </PopoverBase.Content>
      </PopoverBase.Positioner>
    </PopoverBase.Portal>
  );
}

function PopoverTitle(props: ComponentProps<typeof PopoverBase.Title>) {
  return (
    <PopoverBase.Title class="text-base font-semibold text-zinc-900 dark:text-white" {...props} />
  );
}
function PopoverCloseButton(props: ComponentProps<typeof PopoverBase.CloseButton>) {
  return (
    <PopoverBase.CloseButton
      aria-label="Close dialog"
      class="text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white"
      {...props}
    >
      <CrossIcon class="w-4 h-4" />
    </PopoverBase.CloseButton>
  );
}

export function BasicExample(props: ComponentProps<typeof PopoverBase> & { label?: string }) {
  const [local, others] = splitProps(props, ["label"]);
  return (
    <Popover {...others}>
      <PopoverTrigger>{local.label ?? "Open popover"}</PopoverTrigger>
      <PopoverContent>
        <div class="flex items-start justify-between px-4 py-3 border-b rounded-t dark:border-zinc-600">
          <PopoverTitle>About Kobalte</PopoverTitle>
          <PopoverCloseButton />
        </div>
        <div class="p-4 space-y-4 w-72">
          <p class="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            Kobalte is a UI toolkit for building accessible web apps and design systems with
            SolidJS.
          </p>
        </div>
        <div class="flex items-center justify-end px-4 py-3 border-t border-zinc-200 rounded-b dark:border-zinc-600">
          <button
            id="ok-button"
            type="button"
            class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30"
          >
            OK
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ControlledExample() {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <BasicExample placement="top" isOpen={open()} onOpenChange={setOpen} />
      <p class="not-prose text-sm mt-2">The popover is {open() ? "opened" : "closed"}.</p>
    </>
  );
}
