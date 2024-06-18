/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/color-mode.utils.ts
 */

import { isServer } from "solid-js/web";

import type {
	ColorMode,
	ColorModeStorageManager,
	ConfigColorMode,
} from "./types";

export const FALLBACK_COLOR_MODE_VALUE: ConfigColorMode = "system";

function query() {
	return window.matchMedia("(prefers-color-scheme: dark)");
}

function preventTransition() {
	const css = document.createElement("style");
	css.appendChild(
		document.createTextNode(
			"*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
		),
	);
	document.head.appendChild(css);

	return () => {
		// force a reflow
		(() => window.getComputedStyle(document.body))();

		// wait for next tick
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				document.head.removeChild(css);
			});
		});
	};
}

export function setColorModeDataset(
	value: ColorMode,
	shouldPreventTransition = true,
) {
	const cleanup = shouldPreventTransition ? preventTransition() : undefined;
	document.documentElement.dataset.kbTheme = value;
	document.documentElement.style.colorScheme = value;
	cleanup?.();
}

export function getSystemColorMode(fallback?: ColorMode): ColorMode {
	const isDark = query().matches ?? fallback === "dark";
	return isDark ? "dark" : "light";
}

export function getInitialColorMode(
	manager: ColorModeStorageManager,
): ColorMode {
	const fallback: ColorMode = "light";

	const initialColorMode = manager.get(fallback) ?? fallback;

	if (initialColorMode === "system") {
		// We can't know the client system preference in SSR so just return the fallback.
		return isServer ? fallback : getSystemColorMode();
	}

	return initialColorMode;
}
export function addColorModeListener(fn: (cm: ColorMode) => unknown) {
	const mql = query();

	const listener = (e: MediaQueryListEvent) => {
		fn(e.matches ? "dark" : "light");
	};

	mql.addEventListener("change", listener);

	return () => {
		mql.removeEventListener("change", listener);
	};
}
