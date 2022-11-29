/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/i18n/src/context.tsx
 */

import { Accessor, createContext, createMemo, JSX, useContext } from "solid-js";

import { createDefaultLocale, Locale } from "./create-default-locale";
import { getReadingDirection } from "./utils";

interface I18nProviderProps {
  /** Contents that should have the locale applied. */
  children?: JSX.Element;

  /** The locale to apply to the children. */
  locale?: string;
}

const I18nContext = createContext<Accessor<Locale>>();

/**
 * Provides the locale for the application to all child components.
 */
export function I18nProvider(props: I18nProviderProps) {
  const defaultLocale = createDefaultLocale();

  const value = createMemo(() => {
    if (props.locale) {
      return {
        locale: props.locale,
        direction: getReadingDirection(props.locale),
      } as Locale;
    }

    return defaultLocale();
  });

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

/**
 * Returns an accessor for the current locale and layout direction.
 */
export function useLocale(): Accessor<Locale> {
  const defaultLocale = createDefaultLocale();

  const context = useContext(I18nContext);

  return () => context?.() || defaultLocale();
}
