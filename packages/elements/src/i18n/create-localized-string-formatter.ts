/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/useLocalizedStringFormatter.ts
 */

import {
  LocalizedString,
  LocalizedStringDictionary,
  LocalizedStringFormatter,
  LocalizedStrings,
} from "@internationalized/string";
import { Accessor, createMemo } from "solid-js";

import { useLocale } from "./i18n-provider";

const cache = new WeakMap();

function getCachedDictionary<K extends string, T extends LocalizedString>(
  strings: LocalizedStrings<K, T>
): LocalizedStringDictionary<K, T> {
  let dictionary = cache.get(strings);

  if (!dictionary) {
    dictionary = new LocalizedStringDictionary(strings);
    cache.set(strings, dictionary);
  }

  return dictionary;
}

/**
 * Provides localized string formatting for the current locale. Supports interpolating variables,
 * selecting the correct pluralization, and formatting numbers. Automatically updates when the locale changes.
 * @param strings - A mapping of languages to localized strings by key.
 */
export function createLocalizedStringFormatter<
  K extends string = string,
  T extends LocalizedString = string
>(strings: Accessor<LocalizedStrings<K, T>>): Accessor<LocalizedStringFormatter<K, T>> {
  const locale = useLocale();

  return createMemo(() => {
    return new LocalizedStringFormatter<K, T>(locale().locale, getCachedDictionary(strings()));
  });
}
