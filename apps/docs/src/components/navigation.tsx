import { Link, useLocation } from "@solidjs/router";
import { clsx } from "clsx";
import { ComponentProps, For, splitProps } from "solid-js";

import { NavSection } from "../model/navigation";

interface NavigationProps extends ComponentProps<"nav"> {
  sections: NavSection[];
}

export function Navigation(props: NavigationProps) {
  const [local, others] = splitProps(props, ["sections", "class"]);

  const location = useLocation();

  return (
    <nav class={clsx("text-base lg:text-sm w-52", local.class)} {...others}>
      <ul class="space-y-9">
        <For each={local.sections}>
          {section => (
            <li>
              <h2 class="font-display font-medium text-zinc-900 dark:text-white/90">
                {section.title}
              </h2>
              <ul class="mt-2 lg:mt-3 text-sm">
                <For each={section.links}>
                  {link => (
                    <li class="relative group">
                      <Link
                        href={link.href}
                        class={clsx(
                          "block w-full font-sans transition font-normal rounded px-3 py-2 hover:bg-sky-50 dark:hover:bg-sky-900/20",
                          link.href === location.pathname
                            ? "text-sky-700 dark:text-sky-600"
                            : "text-zinc-600 dark:text-zinc-400"
                        )}
                      >
                        {link.title}
                      </Link>
                    </li>
                  )}
                </For>
              </ul>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}
