/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/color-mode-types.ts
 */

import type { Accessor, ParentProps } from "solid-js";

export type ColorMode = "light" | "dark";

export type ConfigColorMode = ColorMode | "system";

export type MaybeConfigColorMode = ConfigColorMode | undefined;

export interface ColorModeStorageManager {
	/** The type of storage. */
	type: "cookie" | "localStorage";

	/** Whether it's an SSR environment. */
	ssr?: boolean;

	/** Get the color mode from the storage. */
	get: (fallback?: ConfigColorMode) => MaybeConfigColorMode;

	/** Save the color mode in the storage. */
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

export type ColorModeScriptProps = {
	/** The initial color mode to use. */
	initialColorMode?: ConfigColorMode;

	/** The type of the color mode storage manager, either localStorage or cookie. */
	storageType?: "localStorage" | "cookie";

	/** The key used to store color mode preference in localStorage or cookie. */
	storageKey?: string;

	nonce?: string;
};
