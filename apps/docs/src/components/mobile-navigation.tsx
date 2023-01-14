import { createDisclosureState, Dialog } from "@kobalte/core";
import { Link, useIsRouting } from "@solidjs/router";
import { ComponentProps, createComputed, splitProps } from "solid-js";

import { NavSection } from "../NAV_SECTIONS";
import { CrossIcon, HamburgerMenuIcon } from "./icons";
import { Navigation } from "./navigation";

interface MobileNavigationProps extends ComponentProps<"button"> {
  sections: NavSection[];
}

export function MobileNavigation(props: MobileNavigationProps) {
  const [local] = splitProps(props, ["sections", "class"]);

  const { isOpen, setIsOpen, open, close } = createDisclosureState();

  const isRouting = useIsRouting();

  createComputed(() => isRouting() && close());

  return (
    <>
      <button type="button" onClick={open} class="relative" aria-label="Open navigation">
        <HamburgerMenuIcon class="h-6 w-6 text-zinc-500" />
      </button>
      <Dialog.Root isOpen={isOpen()} onOpenChange={setIsOpen} aria-label="Navigation">
        <Dialog.Portal>
          <Dialog.Overlay class="fixed inset-0 z-50 flex items-start overflow-y-auto bg-zinc-900/50 pr-10 backdrop-blur lg:hidden" />

          <Dialog.Content class="fixed inset-0 z-50 min-h-full overflow-y-auto w-full max-w-xs bg-white px-4 pt-5 pb-12 dark:bg-zinc-900 sm:px-6">
            <div class="flex items-center">
              <div class="relative flex flex-grow basis-0 items-center space-x-2">
                <Link
                  class="text-zinc-800 dark:text-white/90 font-medium font-display text-xl leading-none"
                  href="/"
                >
                  Kobalte
                  <span class="text-3xl leading-[0] text-sky-600">.</span>
                </Link>
                <span class="rounded bg-zinc-100 px-1.5 py-1 text-sm leading-none dark:bg-zinc-800 dark:text-zinc-300">
                  v0.2.0
                </span>
              </div>
              <button
                type="button"
                class="ml-auto"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
              >
                <CrossIcon class="h-4 w-4 stroke-zinc-500" />
              </button>
            </div>
            <Navigation sections={local.sections} class="mt-5 px-1" />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
