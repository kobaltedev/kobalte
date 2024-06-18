/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/color-mode-context.ts
 */

import { createContext, createMemo, useContext } from "solid-js";

import type { ColorModeContextType } from "./types";

export const ColorModeContext = createContext<ColorModeContextType>();

/**
 * Primitive that reads from `ColorModeProvider` context,
 * Returns the color mode and function to toggle it.
 */
export function useColorMode() {
	const context = useContext(ColorModeContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte]: `useColorMode` must be used within a `ColorModeProvider`",
		);
	}

	return context;
}

/**
 * Change value based on color mode.
 *
 * @param light the light mode value
 * @param dark the dark mode value
 * @return A memoized value based on the color mode.
 *
 * @example
 *
 * ```js
 * const Icon = useColorModeValue(MoonIcon, SunIcon)
 * ```
 */
export function useColorModeValue<TLight = unknown, TDark = unknown>(
	light: TLight,
	dark: TDark,
) {
	const { colorMode } = useColorMode();

	return createMemo(() => (colorMode() === "dark" ? dark : light));
}
