import { Box, Flex, hope, HStack, IconButton, rgba, Text, useColorMode } from "@kobalte/core";
import { Link, useLocation } from "@solidjs/router";
import { ParentProps, Show } from "solid-js";

import { NAV_SECTIONS, NavSection } from "../NAV_SECTIONS";
import { ArrowLeftIcon, ArrowRightIcon, ExclamationTriangleIcon, GitHubIcon } from "./icons";
import { Logo, LogoDark } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { Navigation } from "./navigation";
import { TableOfContents } from "./table-of-contents";
import { ThemeSelector } from "./theme-selector";
import { HeaderLogo } from "./header-logo";

const PageLink = hope(Link, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    color: "neutral.500",
    fontSize: "base",
    lineHeight: 6,
    fontWeight: "semibold",

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
});

const StyledHeader = hope("header", {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",

    boxShadow: "md",
    backgroundColor: "common.background",

    px: [4, 6, null, 8],
    py: 5,

    _dark: {
      boxShadow: "none",
      borderBottom: theme => `1px solid ${theme.vars.colors.neutral["800"]}`,
    },
  },
});

interface HeaderProps {
  navSections: NavSection[];
}

function Header(props: HeaderProps) {
  return (
    <Box pos="sticky" top={0} zIndex="sticky">
      <Box bg="common.background">
        <HStack
          fontSize="sm"
          fontWeight="medium"
          lineHeight={5}
          px={2}
          py={1}
          spacing={1}
          bg="danger.600"
          color="white"
          _dark={{
            bg: theme => rgba(theme.vars.colors.danger.darkChannel, 0.4),
            color: "danger.400",
          }}
        >
          <ExclamationTriangleIcon fontSize="1.3em" />
          <span>
            You are looking at the documentation of the <em>work in progress</em> Kobalte{" "}
            <strong>1.0</strong>, examples and information may be broken or outdated.
          </span>
        </HStack>
      </Box>
      <StyledHeader>
        <Flex d={{ lg: "none" }} mr={4}>
          <MobileNavigation sections={props.navSections} />
        </Flex>
        <HeaderLogo />
        <Box mr={[6, 8, 0]} my={({ vars }) => `calc(${vars.space[5]} * -1)`}>
          {/*<Search />*/}
        </Box>
        <HStack
          pos="relative"
          flexBasis={0}
          justifyContent="flex-end"
          spacing={2}
          flexGrow={{ md: 1 }}
        >
          <IconButton
            as="a"
            variant="plain"
            colorScheme="neutral"
            size="sm"
            href="https://github.com/kobalte/kobalte"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon boxSize={5} />
          </IconButton>
          <ThemeSelector />
        </HStack>
      </StyledHeader>
    </Box>
  );
}

export function Layout(props: ParentProps) {
  const location = useLocation();

  const allLinks = NAV_SECTIONS.flatMap(section => section.links);
  const linkIndex = () => allLinks.findIndex(link => link.href === location.pathname);
  const previousPage = () => allLinks[linkIndex() - 1];
  const nextPage = () => allLinks[linkIndex() + 1];
  const section = () => {
    return NAV_SECTIONS.find(section =>
      section.links.find(link => link.href === location.pathname)
    );
  };

  return (
    <>
      <Header navSections={NAV_SECTIONS} />
      <Flex pos="relative" mx="auto" maxW="8xl" justify="center" px={{ sm: 2, lg: 8, xl: 12 }}>
        <Box d={{ base: "none", lg: "block" }} pos={{ lg: "relative" }} flex={{ lg: "none" }}>
          <Box
            class="hide-scrollbar"
            pos="sticky"
            top="100px" // height of the header
            ml={theme => `calc(${theme.vars.space["0.5"]} * -1)`}
            h="calc(100vh - 100px)" // 100vh - height of the header
            overflowY="auto"
            overflowX="hidden"
            py={16}
            pl={0.5}
          >
            <Navigation sections={NAV_SECTIONS} w={56} pr={2} />
          </Box>
        </Box>
        <Box
          minW={0}
          maxW={{ base: "2xl", lg: "none" }}
          flex="1 1 auto"
          px={{ base: 4, xl: 16 }}
          ps={{ lg: 8 }}
          pe={{ lg: 0 }}
          py={16}
        >
          <article>
            <Show when={section()}>
              <header>
                <Text
                  size="sm"
                  fontFamily="display"
                  fontWeight="medium"
                  color="primary.500"
                  _dark={{ color: "primary.600" }}
                >
                  {section()?.title}
                </Text>
              </header>
            </Show>
            <div>{props.children}</div>
          </article>
          <Flex
            as="dl"
            mt={12}
            pt={6}
            borderTop={theme => `1px solid ${theme.vars.colors.neutral["200"]}`}
            _dark={{
              borderTopColor: "neutral.800",
            }}
          >
            <Show when={previousPage()}>
              <div>
                <hope.dt
                  fontSize="sm"
                  lineHeight={5}
                  fontWeight="medium"
                  color="neutral.900"
                  _dark={{
                    color: "neutral.100",
                  }}
                >
                  Previous
                </hope.dt>
                <hope.dd mt={1}>
                  <PageLink href={previousPage().href}>
                    <ArrowLeftIcon aria-hidden="true" />
                    <span>{previousPage().title}</span>
                  </PageLink>
                </hope.dd>
              </div>
            </Show>
            <Show when={nextPage()}>
              <Box ml="auto" textAlign="right">
                <hope.dt
                  fontSize="sm"
                  lineHeight={5}
                  fontWeight="medium"
                  color="neutral.900"
                  _dark={{
                    color: "neutral.100",
                  }}
                >
                  Next
                </hope.dt>
                <hope.dd mt={1}>
                  <PageLink href={nextPage().href}>
                    <span>{nextPage().title}</span>
                    <ArrowRightIcon aria-hidden="true" />
                  </PageLink>
                </hope.dd>
              </Box>
            </Show>
          </Flex>
        </Box>
        <TableOfContents />
      </Flex>
    </>
  );
}
