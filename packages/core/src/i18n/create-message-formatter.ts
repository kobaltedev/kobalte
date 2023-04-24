/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/23c3a91e7b87952f07da9da115188bd2abd99d77/packages/@react-aria/i18n/src/useMessageFormatter.ts
 */

import { LocalizedStrings, MessageDictionary, MessageFormatter } from "@internationalized/message";
import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createMemo } from "solid-js";

import { useLocale } from "./i18n-provider";

export interface LocalizedMessageFormatter {
  format: (key: string, variables?: { [key: string]: any }) => string;
}

const cache = new WeakMap();

function getCachedDictionary(strings: LocalizedStrings): MessageDictionary {
  let dictionary = cache.get(strings);

  if (!dictionary) {
    dictionary = new MessageDictionary(strings);
    cache.set(strings, dictionary);
  }

  return dictionary;
}

/**
 * Handles formatting ICU Message strings to create localized strings for the current locale.
 * Automatically updates when the locale changes, and handles caching of messages for performance.
 * @param strings - A mapping of languages to strings by key.
 */
export function createMessageFormatter(
  strings: MaybeAccessor<LocalizedStrings>
): Accessor<LocalizedMessageFormatter> {
  const { locale } = useLocale();

  const messageFormatter = createMemo(() => {
    return new MessageFormatter(locale(), getCachedDictionary(access(strings)));
  });

  // Re-export as a new object with narrowed type for the `format()` method.
  return createMemo(() => ({
    format: (key, variables) => messageFormatter().format(key, variables) as string,
  }));
}
