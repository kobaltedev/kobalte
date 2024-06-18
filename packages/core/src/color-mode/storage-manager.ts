/*
 * Original code by Chakra UI
 * MIT Licensed, Copyright (c) 2019 Segun Adebayo.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/color-mode/src/storage-manager.ts
 */

import { isServer } from "solid-js/web";

import type {
	ColorModeStorageManager,
	ConfigColorMode,
	MaybeConfigColorMode,
} from "./types";

export const COLOR_MODE_STORAGE_KEY = "kb-color-mode";

export function createLocalStorageManager(
	key: string,
): ColorModeStorageManager {
	return {
		ssr: false,
		type: "localStorage",
		get: (fallback) => {
			if (isServer) {
				return fallback;
			}

			let value: ConfigColorMode | null | undefined;
			try {
				value = localStorage.getItem(key) as ConfigColorMode;
			} catch (_) {
				// noop
			}

			return value ?? fallback;
		},
		set: (value) => {
			try {
				localStorage.setItem(key, value);
			} catch (e) {
				// noop
			}
		},
	};
}

export const localStorageManager = createLocalStorageManager(
	COLOR_MODE_STORAGE_KEY,
);

function parseCookie(cookie: string, key: string): MaybeConfigColorMode {
	const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
	return match?.[2] as MaybeConfigColorMode;
}

export function createCookieStorageManager(
	key: string,
	cookie?: string,
): ColorModeStorageManager {
	return {
		ssr: !!cookie,
		type: "cookie",
		get: (fallback) => {
			if (cookie) {
				return parseCookie(cookie, key) ?? fallback;
			}

			if (isServer) {
				return fallback;
			}

			return parseCookie(document.cookie, key) ?? fallback;
		},
		set: (value) => {
			document.cookie = `${key}=${value}; max-age=31536000; path=/`;
		},
	};
}

export const cookieStorageManager = createCookieStorageManager(
	COLOR_MODE_STORAGE_KEY,
);

export function cookieStorageManagerSSR(cookie: string) {
	return createCookieStorageManager(COLOR_MODE_STORAGE_KEY, cookie);
}
