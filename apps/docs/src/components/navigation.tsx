import { Anchor, createHopeComponent, Heading, hope, VStack } from "@kobalte/core";
import { Link, useLocation } from "@solidjs/router";
import { For, splitProps } from "solid-js";

import { NavSection } from "../NAV_SECTIONS";

interface NavigationProps {
  sections: NavSection[];
}

export const Navigation = createHopeComponent<"nav", NavigationProps>(props => {
  const [local, others] = splitProps(props, ["sections"]);

  const location = useLocation();

  return (
    <hope.nav fontSize={{ base: "base", lg: "sm" }} lineHeight={{ base: 6, lg: 5 }} {...others}>
      <VStack as="ul" role="list" spacing={9} alignItems="stretch">
        <For each={local.sections}>
          {section => (
            <li>
              <Heading fontWeight="medium" color="neutral.900" _dark={{ color: "neutral.200" }}>
                {section.title}
              </Heading>
              <VStack
                as="ul"
                role="list"
                mt={3}
                spacing={4}
                alignItems="stretch"
                borderLeftWidth="2px"
                borderLeftStyle="solid"
                borderLeftColor="neutral.200"
                _dark={{ borderLeftColor: "neutral.800" }}
              >
                <For each={section.links}>
                  {link => (
                    <hope.li pos="relative">
                      <Anchor
                        as={Link}
                        href={link.href}
                        d="block"
                        w="full"
                        pl={3.5}
                        _before={({ vars }) => ({
                          content: "''",
                          pointerEvents: "none",
                          position: "absolute",
                          left: `calc(${vars.space[1]} * -1)`,
                          top: "50%",
                          boxSize: 1.5,
                          transform: "translateY(-50%)",
                          rounded: "full",
                          ...(link.href === location.pathname
                            ? {
                                backgroundColor: "primary.500",
                              }
                            : {
                                display: "none",
                                backgroundColor: "neutral.300",
                              }),
                        })}
                        {...(link.href === location.pathname
                          ? {
                              fontWeight: "semibold",
                              color: "primary.500",

                              _hover: {
                                textDecoration: "none",
                              },

                              _dark: {
                                color: "primary.600",

                                _before: {
                                  backgroundColor: "primary.600",
                                },
                              },
                            }
                          : {
                              color: "neutral.500",

                              _hover: {
                                color: "neutral.600",
                                textDecoration: "none",

                                _before: {
                                  display: "block",
                                },
                              },

                              _dark: {
                                color: "neutral.400",

                                _hover: {
                                  color: "neutral.300",
                                },

                                _before: {
                                  backgroundColor: "neutral.700",
                                },
                              },
                            })}
                      >
                        {link.title}
                      </Anchor>
                    </hope.li>
                  )}
                </For>
              </VStack>
            </li>
          )}
        </For>
      </VStack>
    </hope.nav>
  );
});
