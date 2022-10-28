/*!
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/storage-manager.ts
 */

import { isServer } from "solid-js/web";

import { ColorModeStorageManager, MaybeColorMode } from "./types";

export const COLOR_MODE_STORAGE_KEY = "kobalte-color-mode";

export function createLocalStorageManager(
  key: string
): ColorModeStorageManager {
  return {
    ssr: false,
    type: "localStorage",
    get: (): MaybeColorMode => {
      if (isServer) {
        return undefined;
      }

      let value: any;
      try {
        value = localStorage.getItem(key);
      } catch (e) {
        // noop
      }

      return value ?? undefined;
    },
    set: value => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // noop
      }
    },
  };
}

export const localStorageManager = createLocalStorageManager(
  COLOR_MODE_STORAGE_KEY
);

function parseCookie(cookie: string, key: string): MaybeColorMode {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match?.[2] as MaybeColorMode;
}

export function createCookieStorageManager(
  key: string,
  cookie?: string
): ColorModeStorageManager {
  return {
    ssr: !!cookie,
    type: "cookie",
    get: (): MaybeColorMode => {
      if (cookie) {
        return parseCookie(cookie, key) ?? undefined;
      }

      if (isServer) {
        return undefined;
      }

      return parseCookie(document.cookie, key) ?? undefined;
    },
    set: value => {
      document.cookie = `${key}=${value}; max-age=31536000; path=/`;
    },
  };
}

export const cookieStorageManager = createCookieStorageManager(
  COLOR_MODE_STORAGE_KEY
);

export function cookieStorageManagerSSR(cookie: string) {
  return createCookieStorageManager(COLOR_MODE_STORAGE_KEY, cookie);
}
