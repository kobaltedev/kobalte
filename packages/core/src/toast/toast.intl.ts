/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/tree/main/packages/%40react-aria/toast/intl
 */

export const TOAST_HOTKEY_PLACEHOLDER = "{hotkey}";

export const TOAST_INTL_TRANSLATIONS = {
  close: "Close",
  notifications: (hotkeyPlaceholder: string) => `Notifications (${hotkeyPlaceholder})`,
};

export type ToastIntlTranslations = typeof TOAST_INTL_TRANSLATIONS;
