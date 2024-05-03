/*
 * Portions of this file are based on code from ariakit
 * MIT Licensed, Copyright (c) Diego Haz.
 *
 * Credits to the ariakit team:
 * https://github.com/hope-ui/hope-ui/blob/54125b130195f37161dbeeea0c21dc3b198bc3ac/packages/core/src/button/is-button.ts
 */

const BUTTON_INPUT_TYPES = [
	"button",
	"color",
	"file",
	"image",
	"reset",
	"submit",
];

/**
 * Checks whether `element` is a native HTML button element.
 * @example
 * isButton(document.querySelector("button")); // true
 * isButton(document.querySelector("input[type='button']")); // true
 * isButton(document.querySelector("div")); // false
 * isButton(document.querySelector("input[type='text']")); // false
 * isButton(document.querySelector("div[role='button']")); // false
 */
export function isButton(element: { tagName: string; type?: string }) {
	const tagName = element.tagName.toLowerCase();

	if (tagName === "button") {
		return true;
	}

	if (tagName === "input" && element.type) {
		return BUTTON_INPUT_TYPES.indexOf(element.type) !== -1;
	}

	return false;
}
