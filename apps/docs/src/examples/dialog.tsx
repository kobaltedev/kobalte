import { Dialog as DialogBase } from "@kobalte/core";
import { ComponentProps, createSignal } from "solid-js";

import { CrossIcon } from "../components";

export function Dialog(props: ComponentProps<typeof DialogBase>) {
  return <DialogBase {...props} />;
}

export function DialogTrigger(props: ComponentProps<typeof DialogBase.Trigger>) {
  return (
    <DialogBase.Trigger
      class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30"
      {...props}
    />
  );
}

export function DialogContent(props: ComponentProps<typeof DialogBase.Content>) {
  return (
    <DialogBase.Portal>
      <DialogBase.Overlay class="z-50 fixed inset-0 bg-black/20" />
      <DialogBase.Positioner class="z-50 fixed inset-0 flex items-center justify-center">
        <DialogBase.Content
          class="relative bg-white rounded-lg shadow dark:bg-zinc-700"
          {...props}
        ></DialogBase.Content>
      </DialogBase.Positioner>
    </DialogBase.Portal>
  );
}

export function DialogTitle(props: ComponentProps<typeof DialogBase.Title>) {
  return (
    <DialogBase.Title class="text-xl font-semibold text-zinc-900 dark:text-white" {...props} />
  );
}

export function DialogCloseButton(props: ComponentProps<typeof DialogBase.CloseButton>) {
  return (
    <DialogBase.CloseButton
      aria-label="Close dialog"
      class="text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-600 dark:hover:text-white"
      {...props}
    >
      <CrossIcon class="w-4 h-4" />
    </DialogBase.CloseButton>
  );
}

export function BasicExample(props: ComponentProps<typeof DialogBase>) {
  return (
    <Dialog {...props}>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-zinc-600">
          <DialogTitle>About Kobalte</DialogTitle>
          <DialogCloseButton />
        </div>
        <div class="p-6 space-y-6 max-w-lg">
          <p class="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            Kobalte is a UI toolkit for building accessible web apps and design systems with
            SolidJS. It provides a set of low-level UI components and primitives which can be the
            foundation for your design system implementation.
          </p>
        </div>
        <div class="flex items-center justify-end p-4 border-t border-zinc-200 rounded-b dark:border-zinc-600">
          <button
            id="ok-button"
            type="button"
            class="appearance-none outline-none h-10 px-4 rounded-md text-white bg-blue-600 dark:text-white/90 disabled:opacity-40 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500/30"
          >
            OK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ControlledExample() {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <BasicExample isOpen={open()} onOpenChange={setOpen} />
      <p class="not-prose text-sm mt-2">The dialog is {open() ? "opened" : "closed"}.</p>
    </>
  );
}
