/*
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the zag team:
 * https://github.com/chakra-ui/zag/blob/c1e6c7689b22bf58741ded7cf224dd9baec2a046/packages/utilities/form-utils/src/form.ts
 */

import { type Accessor, createEffect, on, onCleanup } from "solid-js";

/**
 * Listens for `reset` event on the closest `<form>` element and execute the given handler.
 */
export function createFormResetListener(
	element: Accessor<HTMLElement | null | undefined>,
	handler: () => void,
) {
	createEffect(
		on(element, (element) => {
			if (element == null) {
				return;
			}

			const form = getClosestForm(element);

			if (form == null) {
				return;
			}

			form.addEventListener("reset", handler, { passive: true });

			onCleanup(() => {
				form.removeEventListener("reset", handler);
			});
		}),
	);
}

function getClosestForm(element: HTMLElement) {
	return isFormElement(element) ? element.form : element.closest("form");
}

function isFormElement(
	element: HTMLElement,
): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
	return element.matches("textarea, input, select, button");
}
