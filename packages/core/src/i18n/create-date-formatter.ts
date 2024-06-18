/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/i18n/src/useDateFormatter.ts
 */

import { DateFormatter } from "@internationalized/date";
import { type MaybeAccessor, access } from "@kobalte/utils";
import { type Accessor, createMemo } from "solid-js";

import { useLocale } from "./i18n-provider";

export interface DateFormatterOptions extends Intl.DateTimeFormatOptions {
	calendar?: string;
}

/**
 * Provides localized date formatting for the current locale. Automatically updates when the locale changes,
 * and handles caching of the date formatter for performance.
 * @param options - Formatting options.
 */
export function createDateFormatter(
	options: MaybeAccessor<DateFormatterOptions>,
): Accessor<DateFormatter> {
	const { locale } = useLocale();

	return createMemo(() => new DateFormatter(locale(), access(options)));
}
