import { Link, useMatch } from "@solidjs/router";
import { clsx } from "clsx";

import { NavSection } from "../model/navigation";
import { LATEST_CORE_CHANGELOG_URL } from "../VERSIONS";
import { GitHubIcon } from "./icons";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeSelector } from "./theme-selector";

interface HeaderProps {
  navSections: NavSection[];
}

export function Header(props: HeaderProps) {
  const isChangelogPath = useMatch(() => "/docs/changelog/*");

  return (
    <header
      class={
        "sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white border-b border-b-zinc-200 dark:border-b-zinc-800 px-4 transition duration-500 lg:px-6 dark:bg-zinc-900"
      }
    >
      <div class="mr-6 flex lg:hidden">
        <MobileNavigation sections={props.navSections} />
      </div>
      <div class="relative flex flex-grow basis-0 items-center space-x-2">
        <Link
          class="text-zinc-800 dark:text-white/90 font-medium font-display text-xl leading-none"
          href="/"
        >
          Kobalte
          <span class="text-3xl leading-[0] text-sky-600">.</span>
        </Link>
        <span class="rounded bg-zinc-100 px-1.5 py-1 text-sm leading-none dark:bg-zinc-800 dark:text-zinc-300">
          v0.6.0
        </span>
      </div>

      <div class="relative flex basis-0 justify-end md:flex-grow">
        <div id="docsearch" class="px-1 flex items-center justify-center" />
        <div class="hidden lg:flex text-sm">
          <Link
            href="/docs/core/overview/introduction"
            class={clsx(
              "px-3 py-4 flex items-center justify-center transition",
              !isChangelogPath()
                ? "text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-800"
                : "text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            Core
          </Link>
          <Link
            href={LATEST_CORE_CHANGELOG_URL}
            class={clsx(
              "px-3 py-4 flex items-center justify-center transition",
              isChangelogPath()
                ? "text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-800"
                : "text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            Changelog
          </Link>
        </div>
        <Link
          href="https://github.com/fabien-ml/kobalte"
          target="_blank"
          rel="noopener noreferrer"
          class="p-4 flex items-center justify-center transition rounded text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="GitHub"
        >
          <GitHubIcon class="h-5 w-5" />
        </Link>
        <ThemeSelector />
      </div>
    </header>
  );
}
