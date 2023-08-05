import { Link, useLocation } from "@solidjs/router";
import { clsx } from "clsx";
import { ComponentProps, For, Match, splitProps, Switch } from "solid-js";

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
                          "flex items-center justify-between w-full font-sans transition font-normal rounded px-3 py-2 hover:bg-sky-50 dark:hover:bg-sky-900/20",
                          link.href === location.pathname
                            ? "text-sky-700 dark:text-sky-600"
                            : "text-zinc-600 dark:text-zinc-400"
                        )}
                      >
                        <span>{link.title}</span>
                        <Switch>
                          <Match when={link.status === "new"}>
                            <span class="inline-flex items-center font-medium leading-none uppercase px-1.5 py-1 text-[12px] rounded text-white bg-sky-600">
                              new
                            </span>
                          </Match>
                          <Match when={link.status === "updated"}>
                            <span class="inline-flex items-center font-medium leading-none uppercase px-1.5 py-1 text-[12px] rounded text-amber-800 bg-amber-100">
                              updated
                            </span>
                          </Match>
                        </Switch>
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
