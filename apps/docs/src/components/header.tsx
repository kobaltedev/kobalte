import docsearch from "@docsearch/js";
import { Link, useMatch } from "@solidjs/router";
import { clsx } from "clsx";
import { onMount } from "solid-js";

import { NavSection } from "../model/navigation";
import { LATEST_CORE_CHANGELOG_URL, LATEST_CORE_VERSION_NAME } from "../VERSIONS";
import { GitHubIcon } from "./icons";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeSelector } from "./theme-selector";

interface HeaderProps {
  navSections: NavSection[];
}

export function Header(props: HeaderProps) {
  const isChangelogPath = useMatch(() => "/docs/changelog/*");

  onMount(() => {
    docsearch({
      appId: "H7ZQSI0SAN",
      apiKey: "c9354456dd4bb74c37e4d2b762b89b88",
      indexName: "kobalte",
      container: "#docsearch",
    });
  });

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
          {LATEST_CORE_VERSION_NAME}
        </span>
      </div>

      <div class="relative flex basis-0 justify-end md:flex-grow items-center py-2">
        <div id="docsearch" class="mx-3.5 flex items-center justify-center" />
        <div class="hidden lg:flex lg:space-x-1.5 text-sm">
          <Link
            href="/docs/core/overview/introduction"
            class={clsx(
              "px-3 py-2 rounded-md flex items-center justify-center transition",
              !isChangelogPath()
                ? "text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-800"
                : "text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            Components
          </Link>
          <Link
            href={LATEST_CORE_CHANGELOG_URL}
            class={clsx(
              "px-3 py-2 rounded-md flex items-center justify-center transition",
              isChangelogPath()
                ? "text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-800"
                : "text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            Changelog
          </Link>
        </div>
        <Link
          href="https://github.com/kobaltedev/kobalte"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2.5 mx-2 rounded-md flex items-center justify-center transition rounded text-zinc-700 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="GitHub"
        >
          <GitHubIcon class="h-5 w-5" />
        </Link>
        <ThemeSelector />
      </div>
    </header>
  );
}
