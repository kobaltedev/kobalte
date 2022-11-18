import { Link, useLocation } from "@solidjs/router";
import { ParentProps, Show } from "solid-js";

import { NAV_SECTIONS, NavSection } from "../NAV_SECTIONS";
import { Prose } from "./prose";
import { ThemeSelector } from "./theme-selector";
import { GitHubIcon } from "./icons";

interface HeaderProps {
  navSections: NavSection[];
}

function Header(props: HeaderProps) {
  return (
    <header
      class={
        "sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white border-b border-b-zinc-200 dark:border-b-zinc-800 px-4 py-5 transition duration-500 sm:px-6 lg:px-8 dark:bg-zinc-900"
      }
    >
      <div class="mr-6 flex lg:hidden">{/* MobileNavigation */}</div>
      <div class="relative flex flex-grow basis-0 items-center">Logo</div>
      <div class="-my-5 mr-6 sm:mr-8 md:mr-0">{/* Search */}</div>
      <div class="relative flex basis-0 justify-end gap-4 sm:gap-6 md:flex-grow">
        <ThemeSelector />
        <Link href="https://github.com/fabien-ml/kobalte" class="group" aria-label="GitHub">
          <GitHubIcon class="h-6 w-6 text-zinc-700 group-hover:text-zinc-800 dark:text-zinc-300 dark:group-hover:text-zinc-200" />
        </Link>
      </div>
    </header>
  );
}

export function Layout(props: ParentProps) {
  const location = useLocation();

  const allLinks = NAV_SECTIONS.flatMap(section => section.links);
  const linkIndex = () => allLinks.findIndex(link => link.href === location.pathname);
  const previousPage = () => allLinks[linkIndex() - 1];
  const nextPage = () => allLinks[linkIndex() + 1];

  return (
    <>
      <Header navSections={NAV_SECTIONS} />
      <div class="relative flex justify-center dark:bg-zinc-900">
        <div class="hidden lg:relative lg:block lg:flex-none">
          <div class="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] overflow-y-auto pt-12 pb-16">
            <div class="w-64 xl:w-72">Navigation</div>
          </div>
          <div class="absolute top-0 bottom-0 right-0 w-px bg-zinc-200 dark:bg-zinc-800 block" />
        </div>
        <div class="min-w-0 mx-auto max-w-2xl flex-auto py-16 lg:max-w-8xl">
          <article>
            <Prose>{props.children}</Prose>
          </article>

          <dl class="mt-12 flex border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <Show when={previousPage()}>
              <div>
                <dt class="font-display text-sm font-medium text-zinc-900 dark:text-white">
                  Previous
                </dt>
                <dd class="mt-1">
                  <Link
                    href={previousPage().href}
                    class="text-base font-semibold text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    <span aria-hidden="true">&larr;</span> {previousPage().title}
                  </Link>
                </dd>
              </div>
            </Show>
            <Show when={nextPage()}>
              <div class="ml-auto text-right">
                <dt class="font-display text-sm font-medium text-zinc-900 dark:text-white">Next</dt>
                <dd class="mt-1">
                  <Link
                    href={nextPage().href}
                    class="text-base font-semibold text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                  >
                    {nextPage().title} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </dd>
              </div>
            </Show>
          </dl>
        </div>
      </div>
    </>
  );
}
