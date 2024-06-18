/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useDefaultLocale.ts
 */

import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { type Direction, getReadingDirection } from "./utils";

interface Locale {
	/** The [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code for the locale. */
	locale: string;

	/** The writing direction for the locale. */
	direction: Direction;
}

/**
 * Gets the locale setting of the browser.
 */
export function getDefaultLocale(): Locale {
	let locale =
		(typeof navigator !== "undefined" &&
			// @ts-ignore
			(navigator.language || navigator.userLanguage)) ||
		"en-US";

	try {
		Intl.DateTimeFormat.supportedLocalesOf([locale]);
	} catch (_err) {
		locale = "en-US";
	}

	return {
		locale,
		direction: getReadingDirection(locale),
	};
}

let currentLocale = getDefaultLocale();
const listeners = new Set<(locale: Locale) => void>();

function updateLocale() {
	currentLocale = getDefaultLocale();

	for (const listener of listeners) {
		listener(currentLocale);
	}
}

/**
 * Returns an accessor for the current browser/system language, and updates when it changes.
 */
export function createDefaultLocale() {
	// We cannot determine the browser's language on the server, so default to en-US.
	// This will be updated after hydration on the client to the correct value.
	const defaultSSRLocale: Locale = {
		locale: "en-US",
		direction: "ltr",
	};

	const [defaultClientLocale, setDefaultClientLocale] =
		createSignal(currentLocale);

	const defaultLocale = createMemo(() =>
		isServer ? defaultSSRLocale : defaultClientLocale(),
	);

	onMount(() => {
		if (listeners.size === 0) {
			window.addEventListener("languagechange", updateLocale);
		}

		listeners.add(setDefaultClientLocale);

		onCleanup(() => {
			listeners.delete(setDefaultClientLocale);

			if (listeners.size === 0) {
				window.removeEventListener("languagechange", updateLocale);
			}
		});
	});

	return {
		locale: () => defaultLocale().locale,
		direction: () => defaultLocale().direction,
	};
}
