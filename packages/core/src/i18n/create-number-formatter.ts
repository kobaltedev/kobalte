/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useNumberFormatter.ts
 */

import {
	type NumberFormatOptions,
	NumberFormatter,
} from "@internationalized/number";
import { type MaybeAccessor, access } from "@kobalte/utils";
import { type Accessor, createMemo } from "solid-js";

import { useLocale } from "./i18n-provider";

/**
 * Provides localized number formatting for the current locale. Automatically updates when the locale changes,
 * and handles caching of the number formatter for performance.
 * @param options - Formatting options.
 */
export function createNumberFormatter(
	options: MaybeAccessor<NumberFormatOptions>,
): Accessor<Intl.NumberFormat> {
	const { locale } = useLocale();

	return createMemo(() => new NumberFormatter(locale(), access(options)));
}
