import { Link, useLocation } from "@solidjs/router";
import { ParentProps, Show } from "solid-js";

import { NAV_SECTIONS } from "../NAV_SECTIONS";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { Prose } from "./prose";
import { TableOfContents } from "./table-of-contents";
import { Footer } from "./footer";

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
          <div class="sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto py-6 pl-6">
            <Navigation sections={NAV_SECTIONS} />
          </div>
        </div>
        <div class="min-w-0 mx-auto max-w-2xl flex-auto px-4 xl:px-16 py-16 lg:max-w-4xl">
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
          <Footer />
        </div>
        <TableOfContents />
      </div>
    </>
  );
}
