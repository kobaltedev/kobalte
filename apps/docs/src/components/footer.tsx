import { Link } from "@solidjs/router";

import { DiscordIcon, GitHubIcon, OpenCollectiveIcon, TwitterIcon } from "./icons";

export function Footer() {
  return (
    <footer class="mt-6 border-t border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row items-baseline justify-between gap-4 py-8 md:py-12">
          <div>
            <div class="mb-2">
              <Link class="inline-block font-semibold font-display text-xl" href="/">
                Kobalte
                <span class="text-3xl text-sky-600 leading-[0]">.</span>
              </Link>
            </div>
            <div class="text-sm text-gray-600">
              <span class="text-sm text-zinc-700 mr-4 dark:text-zinc-400">
                Made in 🇫🇷 by Fabien MARIE-LOUISE.
              </span>
            </div>
          </div>
          <div>
            <div class="text-zinc-800 dark:text-zinc-300 font-medium mb-2">Community</div>
            <ul class="text-sm flex items-center space-x-6">
              <li class="mb-2">
                <a
                  aria-label="Github"
                  class="flex items-center text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 transition duration-150 ease-in-out"
                  href="https://github.com/kobaltedev/kobalte"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon class="h-4 w-4" />
                </a>
              </li>
              <li class="mb-2">
                <a
                  aria-label="Open Collective"
                  class="flex items-center text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 transition duration-150 ease-in-out"
                  href="https://opencollective.com/kobalte"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OpenCollectiveIcon class="h-4 w-4" />
                </a>
              </li>
              <li class="mb-2">
                <a
                  aria-label="Discord"
                  class="flex items-center text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 transition duration-150 ease-in-out"
                  href="https://discord.com/channels/722131463138705510/1063803756388548709"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DiscordIcon class="h-4 w-4" />
                </a>
              </li>
              <li class="mb-2">
                <a
                  aria-label="Twitter"
                  class="flex items-center text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 transition duration-150 ease-in-out"
                  href="https://twitter.com/MLFabien"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon class="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
