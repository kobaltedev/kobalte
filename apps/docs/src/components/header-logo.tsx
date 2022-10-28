import { createHopeComponent, Flex, hope, HStack, useColorMode } from "@kobalte/core";
import { Link } from "@solidjs/router";
import { Show } from "solid-js";

import { Logo, LogoDark } from "./logo";

export const HeaderLogo = createHopeComponent<"div">(props => {
  const { colorMode } = useColorMode();

  return (
    <Flex pos="relative" alignItems="center" flexGrow={1} flexBasis={0} {...props}>
      <HStack as={Link} href="/" aria-label="Home page" spacing={2}>
        <Show when={colorMode() === "dark"} fallback={<Logo boxSize={8} />}>
          <LogoDark boxSize={8} />
        </Show>
        <hope.span
          color="neutral.900"
          fontWeight="medium"
          fontSize="xl"
          _dark={{
            color: "neutral.200",
          }}
        >
          Hope
          <hope.span
            color="primary.500"
            fontWeight="bold"
            ml={1}
            _dark={{
              color: "primary.600",
            }}
          >
            UI
          </hope.span>
        </hope.span>
        <hope.span
          rounded="sm"
          bg="neutral.100"
          px="1.5"
          py="1"
          fontSize="sm"
          lineHeight="none"
          fontWeight="medium"
          _dark={{
            bg: "neutral.800",
            color: "neutral.300",
          }}
        >
          v1.0.0-next.6
        </hope.span>
      </HStack>
    </Flex>
  );
});
