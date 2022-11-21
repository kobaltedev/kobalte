import { Link } from "@solidjs/router";

import { NavSection } from "../NAV_SECTIONS";
import { GitHubIcon } from "./icons";
import { ThemeSelector } from "./theme-selector";

interface HeaderProps {
  navSections: NavSection[];
}

export function Header(props: HeaderProps) {
  return (
    <header
      class={
        "sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white border-b border-b-zinc-200 dark:border-b-zinc-800 p-4 transition duration-500 lg:px-6 dark:bg-zinc-900"
      }
    >
      <div class="mr-6 flex lg:hidden">{/* MobileNavigation */}</div>
      <div class="relative flex flex-grow basis-0 items-center space-x-2">
        <Link
          class="text-zinc-800 dark:text-white/90 font-medium font-display text-xl leading-none"
          href="/"
        >
          Kobalte
          <span class="text-3xl leading-[0] text-sky-600">.</span>
        </Link>
        <span class="rounded bg-zinc-100 px-1.5 py-1 text-sm leading-none dark:bg-zinc-800 dark:text-zinc-300">
          v0.1.0
        </span>
      </div>
      <div class="-my-5 mr-6 sm:mr-8 md:mr-0">{/* Search */}</div>
      <div class="relative flex basis-0 justify-end gap-2 sm:gap-4 md:flex-grow">
        <ThemeSelector />
        <Link
          href="https://github.com/fabien-ml/kobalte"
          target="_blank"
          rel="noopener noreferrer"
          class="p-1 flex items-center justify-center transition rounded text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="GitHub"
        >
          <GitHubIcon class="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
