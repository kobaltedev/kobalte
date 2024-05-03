/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a9dea8a3672179e6c38aafd1429daf44c7ea2ff6/packages/@react-aria/utils/src/focusWithoutScrolling.ts
 */

// This is a polyfill for element.focus({preventScroll: true});
// Currently necessary for Safari and old Edge:
// https://caniuse.com/#feat=mdn-api_htmlelement_focus_preventscroll_option
// See https://bugs.webkit.org/show_bug.cgi?id=178583

// Original licensing for the following methods can be found in the
// NOTICE file in the root directory of this source tree.
// See https://github.com/calvellido/focus-options-polyfill

interface ScrollableElement {
	element: HTMLElement;
	scrollTop: number;
	scrollLeft: number;
}

export function focusWithoutScrolling(element: HTMLElement | null | undefined) {
	if (!element) {
		return;
	}

	if (supportsPreventScroll()) {
		element.focus({ preventScroll: true });
	} else {
		const scrollableElements = getScrollableElements(element);
		element.focus();
		restoreScrollPosition(scrollableElements);
	}
}

let supportsPreventScrollCached: boolean | null = null;

function supportsPreventScroll() {
	if (supportsPreventScrollCached == null) {
		supportsPreventScrollCached = false;
		try {
			const focusElem = document.createElement("div");
			focusElem.focus({
				get preventScroll() {
					supportsPreventScrollCached = true;
					return true;
				},
			});
		} catch (e) {
			// Ignore
		}
	}

	return supportsPreventScrollCached;
}

function getScrollableElements(element: HTMLElement): ScrollableElement[] {
	let parent = element.parentNode;
	const scrollableElements: ScrollableElement[] = [];
	const rootScrollingElement =
		document.scrollingElement || document.documentElement;

	while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
		if (
			parent.offsetHeight < parent.scrollHeight ||
			parent.offsetWidth < parent.scrollWidth
		) {
			scrollableElements.push({
				element: parent,
				scrollTop: parent.scrollTop,
				scrollLeft: parent.scrollLeft,
			});
		}
		parent = parent.parentNode;
	}

	if (rootScrollingElement instanceof HTMLElement) {
		scrollableElements.push({
			element: rootScrollingElement,
			scrollTop: rootScrollingElement.scrollTop,
			scrollLeft: rootScrollingElement.scrollLeft,
		});
	}

	return scrollableElements;
}

function restoreScrollPosition(scrollableElements: ScrollableElement[]) {
	for (const { element, scrollTop, scrollLeft } of scrollableElements) {
		element.scrollTop = scrollTop;
		element.scrollLeft = scrollLeft;
	}
}
