/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/f6e686fe9d3b983d48650980c1ecfdde320bc62f/packages/@react-aria/focus/src/FocusScope.tsx
 */

import type { Accessor } from "solid-js";

import { focusWithoutScrolling } from "./focus-without-scrolling";
import {
	FOCUSABLE_ELEMENT_SELECTOR,
	TABBABLE_ELEMENT_SELECTOR,
	isElementVisible,
} from "./tabbable";

export interface FocusManager {
	/** Moves focus to the next focusable or tabbable element in the focus scope. */
	focusNext(opts?: FocusManagerOptions): HTMLElement | undefined;

	/** Moves focus to the previous focusable or tabbable element in the focus scope. */
	focusPrevious(opts?: FocusManagerOptions): HTMLElement | undefined;

	/** Moves focus to the first focusable or tabbable element in the focus scope. */
	focusFirst(opts?: FocusManagerOptions): HTMLElement | undefined;

	/** Moves focus to the last focusable or tabbable element in the focus scope. */
	focusLast(opts?: FocusManagerOptions): HTMLElement | undefined;
}

export interface FocusManagerOptions {
	/** The element to start searching from. The currently focused element by default. */
	from?: Element;

	/** Whether to only include tabbable elements, or all focusable elements. */
	tabbable?: boolean;

	/** Whether focus should wrap around when it reaches the end of the scope. */
	wrap?: boolean;

	/** A callback that determines whether the given element is focused. */
	accept?: (node: Element) => boolean;
}

/**
 * Creates a FocusManager object that can be used to move focus within an element.
 */
export function createFocusManager(
	ref: Accessor<HTMLElement | undefined>,
	defaultOptions: Accessor<FocusManagerOptions> = () => ({}),
): FocusManager {
	const focusNext = (opts: FocusManagerOptions = {}) => {
		const root = ref();

		if (!root) {
			return;
		}

		const {
			from = defaultOptions().from || document.activeElement,
			tabbable = defaultOptions().tabbable,
			wrap = defaultOptions().wrap,
			accept = defaultOptions().accept,
		} = opts;

		const walker = getFocusableTreeWalker(root, { tabbable, accept });

		if (from && root.contains(from)) {
			walker.currentNode = from;
		}

		let nextNode = walker.nextNode() as HTMLElement | undefined;

		if (!nextNode && wrap) {
			walker.currentNode = root;
			nextNode = walker.nextNode() as HTMLElement | undefined;
		}

		if (nextNode) {
			focusElement(nextNode, true);
		}

		return nextNode;
	};

	const focusPrevious = (opts: FocusManagerOptions = {}) => {
		const root = ref();

		if (!root) {
			return;
		}

		const {
			from = defaultOptions().from || document.activeElement,
			tabbable = defaultOptions().tabbable,
			wrap = defaultOptions().wrap,
			accept = defaultOptions().accept,
		} = opts;

		const walker = getFocusableTreeWalker(root, { tabbable, accept });

		if (from && root.contains(from)) {
			walker.currentNode = from;
		} else {
			const next = last(walker);
			if (next) {
				focusElement(next, true);
			}
			return next;
		}

		let previousNode = walker.previousNode() as HTMLElement | undefined;

		if (!previousNode && wrap) {
			walker.currentNode = root;
			previousNode = last(walker);
		}

		if (previousNode) {
			focusElement(previousNode, true);
		}

		return previousNode;
	};

	const focusFirst = (opts: FocusManagerOptions = {}) => {
		const root = ref();

		if (!root) {
			return;
		}

		const {
			tabbable = defaultOptions().tabbable,
			accept = defaultOptions().accept,
		} = opts;

		const walker = getFocusableTreeWalker(root, { tabbable, accept });
		const nextNode = walker.nextNode() as HTMLElement | undefined;

		if (nextNode) {
			focusElement(nextNode, true);
		}

		return nextNode;
	};

	const focusLast = (opts: FocusManagerOptions = {}) => {
		const root = ref();

		if (!root) {
			return;
		}

		const {
			tabbable = defaultOptions().tabbable,
			accept = defaultOptions().accept,
		} = opts;

		const walker = getFocusableTreeWalker(root, { tabbable, accept });
		const next = last(walker);

		if (next) {
			focusElement(next, true);
		}

		return next;
	};

	return { focusNext, focusPrevious, focusFirst, focusLast };
}

function focusElement(element: HTMLElement | null, scroll = false) {
	if (element != null && !scroll) {
		try {
			focusWithoutScrolling(element);
		} catch (err) {
			// ignore
		}
	} else if (element != null) {
		try {
			element.focus();
		} catch (err) {
			// ignore
		}
	}
}

function last(walker: TreeWalker) {
	let next: HTMLElement | undefined;
	let last: HTMLElement | undefined;

	do {
		last = walker.lastChild() as HTMLElement;
		if (last) {
			next = last;
		}
	} while (last);

	return next;
}

function isElementInScope(element: Element | null, scope: HTMLElement[]) {
	return scope.some((node) => node.contains(element));
}

/**
 * Create a [TreeWalker]{@link https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker}
 * that matches all focusable/tabbable elements.
 */
export function getFocusableTreeWalker(
	root: HTMLElement,
	opts?: FocusManagerOptions,
	scope?: HTMLElement[],
) {
	const selector = opts?.tabbable
		? TABBABLE_ELEMENT_SELECTOR
		: FOCUSABLE_ELEMENT_SELECTOR;
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
		acceptNode(node) {
			// Skip nodes inside the starting node.
			if (opts?.from?.contains(node)) {
				return NodeFilter.FILTER_REJECT;
			}

			if (
				(node as HTMLElement).matches(selector) &&
				isElementVisible(node as HTMLElement) &&
				(!scope || isElementInScope(node as HTMLElement, scope)) &&
				(!opts?.accept || opts.accept(node as Element))
			) {
				return NodeFilter.FILTER_ACCEPT;
			}

			return NodeFilter.FILTER_SKIP;
		},
	});

	if (opts?.from) {
		walker.currentNode = opts.from;
	}

	return walker;
}
