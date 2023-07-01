/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/99ca82e87ba2d7fdd54f5b49326fd242320b4b51/packages/%40react-aria/datepicker/src/useDisplayNames.ts
 */

import { MessageDictionary } from "@internationalized/message";
import { Accessor, createMemo } from "solid-js";

import { useLocale } from "../i18n";
import { DATE_PICKER_INTL_MESSAGES } from "./date-picker.intl";

type Field = Intl.DateTimeFormatPartTypes;

interface DisplayNames {
  of(field: Field): string;
}

class DisplayNamesPolyfill implements DisplayNames {
  private locale: string;
  private dictionary: MessageDictionary;

  constructor(locale: string) {
    this.locale = locale;
    this.dictionary = new MessageDictionary(DATE_PICKER_INTL_MESSAGES);
  }

  of(field: Field): string {
    return this.dictionary.getStringForLocale(field, this.locale);
  }
}

export function createDisplayNames(): Accessor<DisplayNames> {
  const locale = useLocale();

  return createMemo(() => {
    // Try to use `Intl.DisplayNames` if possible. It may be supported in browsers, but not support the dateTimeField
    // type as that was only added in v2. https://github.com/tc39/intl-displaynames-v2
    try {
      return new Intl.DisplayNames(locale.locale(), { type: "dateTimeField" }) as DisplayNames;
    } catch (err) {
      return new DisplayNamesPolyfill(locale.locale());
    }
  });
}
