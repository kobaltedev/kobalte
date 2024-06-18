/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/cf9ab24f3255be1530d0f584061a01aa1e8180e6/packages/@react-aria/utils/src/platform.ts
 */

function testUserAgent(re: RegExp) {
	if (typeof window === "undefined" || window.navigator == null) {
		return false;
	}
	return (
		// @ts-ignore
		window.navigator.userAgentData?.brands.some(
			(brand: { brand: string; version: string }) => re.test(brand.brand),
		) || re.test(window.navigator.userAgent)
	);
}

function testPlatform(re: RegExp) {
	return typeof window !== "undefined" && window.navigator != null
		? re.test(
				// @ts-ignore
				window.navigator.userAgentData?.platform || window.navigator.platform,
			)
		: false;
}

export function isMac() {
	return testPlatform(/^Mac/i);
}

export function isIPhone() {
	return testPlatform(/^iPhone/i);
}

export function isIPad() {
	return (
		testPlatform(/^iPad/i) ||
		// iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
		(isMac() && navigator.maxTouchPoints > 1)
	);
}

export function isIOS() {
	return isIPhone() || isIPad();
}

export function isAppleDevice() {
	return isMac() || isIOS();
}

export function isWebKit() {
	return testUserAgent(/AppleWebKit/i) && !isChrome();
}

export function isChrome() {
	return testUserAgent(/Chrome/i);
}

export function isAndroid() {
	return testUserAgent(/Android/i);
}
