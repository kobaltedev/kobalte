/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/color-mode-types.ts
 */

import { Accessor, ParentProps } from "solid-js";

export type ColorMode = "light" | "dark";

export type ConfigColorMode = ColorMode | "system";

export type MaybeColorMode = ColorMode | undefined;

export interface ColorModeStorageManager {
  type: "cookie" | "localStorage";
  ssr?: boolean;
  get: () => MaybeColorMode;
  set: (value: ConfigColorMode) => void;
}

export interface ColorModeContextType {
  colorMode: Accessor<ColorMode>;
  setColorMode: (value: ConfigColorMode) => void;
  toggleColorMode: () => void;
}

export interface ColorModeOptions {
  /** The initial color mode to use. */
  initialColorMode?: ConfigColorMode;

  /** Whether css transitions should be disabled during the color mode changes. */
  disableTransitionOnChange?: boolean;

  /** The color mode storage manager, either localStorage or cookie. */
  storageManager?: ColorModeStorageManager;
}

export type ColorModeProviderProps = ParentProps<ColorModeOptions>;
