import {
  Box,
  ColorSystem,
  Grid,
  GridItem,
  hope,
  HStack,
  useColorMode,
  useTheme,
  VStack,
} from "@kobalte/core";
import { For, Show } from "solid-js";

interface ColorScaleProps {
  name: keyof ColorSystem;
}

export function ColorScale(props: ColorScaleProps) {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const colors = () => {
    if (colorMode() === "light") {
      return theme.colors.light[props.name];
    }

    // hack to show all colors in the doc, since the dark object only has dark colors
    return {
      ...theme.colors.light[props.name],
      ...theme.colors.dark[props.name],
    };
  };

  return (
    <Grid
      templateColumns={{
        base: "repeat(2, minmax(0, 1fr))",
        md: "repeat(3, minmax(0, 1fr))",
      }}
      gap={8}
      mt={6}
    >
      <For each={Object.entries(colors())}>
        {([key, value]) => (
          <Show when={!key.toLowerCase().endsWith("channel")}>
            <GridItem>
              <HStack spacing={3}>
                <Box
                  boxSize={{ base: 10, sm: 12 }}
                  flexShrink={0}
                  rounded="md"
                  shadow="inner"
                  bg={value}
                />
                <VStack alignItems="flex-start">
                  <hope.span fontSize="sm" fontWeight="semibold">
                    {key}
                  </hope.span>
                  <hope.span fontSize="sm" textTransform="lowercase">
                    {value}
                  </hope.span>
                </VStack>
              </HStack>
            </GridItem>
          </Show>
        )}
      </For>
    </Grid>
  );
}
