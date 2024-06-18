/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useCollator.ts
 */

import { type Accessor, createMemo } from "solid-js";

import { useLocale } from "./i18n-provider";

const cache = new Map<string, Intl.Collator>();

/**
 * Provides localized string collation for the current locale. Automatically updates when the locale changes,
 * and handles caching of the collator for performance.
 * @param options - Collator options.
 */
export function createCollator(
	options?: Intl.CollatorOptions,
): Accessor<Intl.Collator> {
	const { locale } = useLocale();

	const cacheKey = createMemo(() => {
		return (
			locale() +
			(options
				? Object.entries(options)
						.sort((a, b) => (a[0] < b[0] ? -1 : 1))
						.join()
				: "")
		);
	});

	return createMemo(() => {
		const key = cacheKey();
		let collator: Intl.Collator | undefined;

		if (cache.has(key)) {
			collator = cache.get(key);
		}

		if (!collator) {
			collator = new Intl.Collator(locale(), options);
			cache.set(key, collator);
		}

		return collator;
	});
}
