/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/22cb32d329e66c60f55d4fc4025d1d44bb015d71/packages/@react-aria/i18n/src/useFilter.ts
 */

import { createCollator } from "./create-collator";

export interface Filter {
  /** Returns whether a string starts with a given substring. */
  startsWith(string: string, substring: string): boolean;

  /** Returns whether a string ends with a given substring. */
  endsWith(string: string, substring: string): boolean;

  /** Returns whether a string contains a given substring. */
  contains(string: string, substring: string): boolean;
}

/**
 * Provides localized string search functionality that is useful for filtering or matching items
 * in a list. Options can be provided to adjust the sensitivity to case, diacritics, and other parameters.
 */
export function createFilter(options?: Intl.CollatorOptions): Filter {
  const collator = createCollator({
    usage: "search",
    ...options,
  });

  // TODO: these methods don't currently support the ignorePunctuation option.

  const startsWith = (str: string, substr: string) => {
    if (substr.length === 0) {
      return true;
    }

    // Normalize both strings so we can slice safely
    // TODO: take into account the ignorePunctuation option as well...
    str = str.normalize("NFC");
    substr = substr.normalize("NFC");
    return collator().compare(str.slice(0, substr.length), substr) === 0;
  };

  const endsWith = (str: string, substr: string) => {
    if (substr.length === 0) {
      return true;
    }

    str = str.normalize("NFC");
    substr = substr.normalize("NFC");
    return collator().compare(str.slice(-substr.length), substr) === 0;
  };

  const contains = (str: string, substr: string) => {
    if (substr.length === 0) {
      return true;
    }

    str = str.normalize("NFC");
    substr = substr.normalize("NFC");

    let scan = 0;
    const sliceLen = substr.length;

    for (; scan + sliceLen <= str.length; scan++) {
      const slice = str.slice(scan, scan + sliceLen);

      if (collator().compare(substr, slice) === 0) {
        return true;
      }
    }

    return false;
  };

  return {
    startsWith,
    endsWith,
    contains,
  };
}
