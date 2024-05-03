/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/tree/main/packages/%40react-aria/toast/intl
 */

export const TOAST_HOTKEY_PLACEHOLDER = "{hotkey}";

export const TOAST_INTL_TRANSLATIONS = {
	// `aria-label` of Toast.CloseButton.
	close: "Close",
};

export type ToastIntlTranslations = typeof TOAST_INTL_TRANSLATIONS;

export const TOAST_REGION_INTL_TRANSLATIONS = {
	// `aria-label` of Toast.Region with notification count.
	notifications: (hotkeyPlaceholder: string) =>
		`Notifications (${hotkeyPlaceholder})`,
};

export type ToastRegionIntlTranslations = typeof TOAST_REGION_INTL_TRANSLATIONS;
