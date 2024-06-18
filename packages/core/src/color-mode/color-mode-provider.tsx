/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/color-mode-provider.tsx
 */

import { createEffect, createSignal, onCleanup } from "solid-js";

import { ColorModeContext } from "./color-mode-context";
import { localStorageManager } from "./storage-manager";
import type {
	ColorMode,
	ColorModeContextType,
	ColorModeProviderProps,
	ConfigColorMode,
} from "./types";
import {
	FALLBACK_COLOR_MODE_VALUE,
	addColorModeListener,
	getInitialColorMode,
	getSystemColorMode,
	setColorModeDataset,
} from "./utils";

/**
 * Provides context for the color mode based on config in `theme`
 * Returns the color mode and function to toggle the color mode
 */
export function ColorModeProvider(props: ColorModeProviderProps) {
	const fallbackColorMode = () =>
		props.initialColorMode ?? FALLBACK_COLOR_MODE_VALUE;
	const colorModeManager = () => props.storageManager ?? localStorageManager;
	let colorModeListenerCleanupFn: (() => unknown) | undefined;

	const [colorMode, rawSetColorMode] = createSignal(
		getInitialColorMode(colorModeManager()),
	);

	const applyColorMode = (value: ColorMode) => {
		rawSetColorMode(value);

		setColorModeDataset(value, props.disableTransitionOnChange);
	};

	const setColorMode = (value: ConfigColorMode) => {
		if (colorModeListenerCleanupFn) {
			colorModeListenerCleanupFn();
			colorModeListenerCleanupFn = undefined;
		}

		const isSystem = value === "system";

		if (isSystem) {
			colorModeListenerCleanupFn = addColorModeListener(applyColorMode);
		}

		applyColorMode(isSystem ? getSystemColorMode() : value);
		colorModeManager().set(value);
	};

	const toggleColorMode = () => {
		setColorMode(colorMode() === "dark" ? "light" : "dark");
	};

	createEffect(() => {
		setColorMode(colorModeManager().get() ?? fallbackColorMode());
	});

	onCleanup(() => {
		// ensure listener is always cleaned when component is destroyed.
		colorModeListenerCleanupFn?.();
	});

	const context: ColorModeContextType = {
		colorMode,
		setColorMode,
		toggleColorMode,
	};

	return (
		<ColorModeContext.Provider value={context}>
			{props.children}
		</ColorModeContext.Provider>
	);
}
