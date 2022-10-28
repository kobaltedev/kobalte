import { Heading, hope, VStack } from "@kobalte/core";
import { Link, useLocation } from "@solidjs/router";
import { Accessor, createEffect, createSignal, For, onCleanup, Suspense } from "solid-js";
import { createServerData$ } from "solid-start/server";

import { mods } from "../root";

interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

function getHeadingsFromToc(tableOfContents: TocItem[]) {
  return tableOfContents.map(({ slug }) => {
    const el = document.getElementById(slug);

    if (!el) {
      return;
    }

    const style = window.getComputedStyle(el);
    const scrollMt = parseFloat(style.scrollMarginTop) + 1;

    const top = window.scrollY + el.getBoundingClientRect().top - scrollMt;

    return { slug, top };
  });
}

function useCurrentSection(tableOfContents: Accessor<TocItem[] | undefined>) {
  const [currentSection, setCurrentSection] = createSignal(tableOfContents()?.[0].slug);

  createEffect(() => {
    const toc = tableOfContents();

    if (toc == null || toc.length === 0) {
      return;
    }

    const headings = getHeadingsFromToc(toc);

    function onScroll() {
      const top = window.scrollY;
      let current = headings[0]?.slug;

      for (const heading of headings) {
        if (heading == null) {
          continue;
        }

        if (top >= heading.top) {
          current = heading.slug;
        } else {
          break;
        }
      }

      setCurrentSection(current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    onCleanup(() => {
      // @ts-ignore
      window.removeEventListener("scroll", onScroll, { passive: true });
    });
  });

  return currentSection;
}

const TocLink = hope(Link, {
  baseStyle: {
    display: "flex",
    alignItems: "center",

    color: "neutral.500",
    fontSize: "sm",
    fontWeight: "normal",
    lineHeight: 5,

    _hover: {
      color: "neutral.600",
    },

    _dark: {
      color: "neutral.400",

      _hover: {
        color: "neutral.300",
      },
    },
  },
  variants: {
    isIndent: {
      true: {
        pl: 5,
      },
    },
    isActive: {
      true: {
        color: "primary.500",

        _hover: {
          color: "primary.600",
        },
        _dark: {
          color: "primary.600",

          _hover: {
            color: "primary.500",
          },
        },
      },
    },
  },
});

const TocRoot = hope("div", theme => ({
  baseStyle: {
    display: "none",

    [`@media screen and (min-width: ${theme.breakpoints.xl})`]: {
      display: "block",
      position: "sticky",
      top: "100px", // height of the header
      height: "calc(100vh - 100px)", // 100vh - height of the header
      mr: `calc(${theme.vars.space["6"]}) * -1`,
      flex: "none",
      overflowX: "hidden",
      overflowY: "auto",
      py: 16,
      pr: 2,
    },
  },
}));

export function TableOfContents() {
  const path = useLocation();

  const toc = createServerData$(
    async pathname => {
      const mod = mods[`./routes${pathname}.mdx`] ?? mods[`./routes${pathname}.md`];
      return !mod ? [] : mod.getHeadings().filter(h => h.depth > 1 && h.depth <= 3);
    },
    {
      key: () => path.pathname,
    }
  );

  const currentSection = useCurrentSection(toc);

  return (
    <TocRoot class="hide-scrollbar">
      <hope.nav aria-labelledby="on-this-page-title" w={56}>
        <Suspense>
          <Heading
            id="on-this-page-title"
            color="neutral.900"
            fontFamily="display"
            fontWeight="medium"
            fontSize="sm"
            lineHeight={5}
            _dark={{
              color: "neutral.200",
            }}
          >
            On this page
          </Heading>
          <VStack as="ol" mt={4} align="stretch" spacing={3}>
            <For each={toc()}>
              {section => (
                <li>
                  <h3>
                    <TocLink
                      isIndent={section.depth === 3}
                      isActive={section.slug === currentSection()}
                      href={`${path.pathname}#${section.slug}`}
                    >
                      {section.text}
                    </TocLink>
                  </h3>
                </li>
              )}
            </For>
          </VStack>
        </Suspense>
      </hope.nav>
    </TocRoot>
  );
}
