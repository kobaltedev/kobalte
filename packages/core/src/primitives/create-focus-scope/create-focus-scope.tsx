/*
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/focus-scope/src/FocusScope.tsx
 *
 * Portions of this file are based on code from zag.
 * MIT Licensed, Copyright (c) 2021 Chakra UI.
 *
 * Credits to the Chakra UI team:
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-on-child-unmount.ts
 * https://github.com/chakra-ui/zag/blob/d1dbf9e240803c9e3ed81ebef363739be4273de0/packages/utilities/focus-scope/src/focus-containment.ts
 */

import {
	type MaybeAccessor,
	access,
	contains,
	focusWithoutScrolling,
	getActiveElement,
	getAllTabbableIn,
	getDocument,
	isFocusable,
	removeItemFromArray,
	visuallyHiddenStyles,
} from "@kobalte/utils";
import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

import { DATA_TOP_LAYER_ATTR } from "../../dismissable-layer/layer-stack";

const AUTOFOCUS_ON_MOUNT_EVENT = "focusScope.autoFocusOnMount";
const AUTOFOCUS_ON_UNMOUNT_EVENT = "focusScope.autoFocusOnUnmount";
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

interface FocusScopeAPI {
	pause(): void;
	resume(): void;
}

export interface CreateFocusScopeProps {
	/** Whether focus cannot escape the focus scope via keyboard, pointer, or a programmatic focus. */
	trapFocus?: MaybeAccessor<boolean | undefined>;

	/**
	 * Event handler called when autofocusing on mount.
	 * Can be prevented.
	 */
	onMountAutoFocus?: (event: Event) => void;

	/**
	 * Event handler called when autofocusing on unmount.
	 * Can be prevented.
	 */
	onUnmountAutoFocus?: (event: Event) => void;
}

const focusScopeStack = {
	/** A stack of focus scopes, with the active one at the top */
	stack: [] as FocusScopeAPI[],
	active() {
		return this.stack[0];
	},
	add(scope: FocusScopeAPI) {
		// pause the currently active focus scope (at the top of the stack)
		if (scope !== this.active()) {
			this.active()?.pause();
		}

		// remove in case it already exists and re-add it at the top of the stack.
		this.stack = removeItemFromArray(this.stack, scope);
		this.stack.unshift(scope);
	},
	remove(scope: FocusScopeAPI) {
		this.stack = removeItemFromArray(this.stack, scope);
		this.active()?.resume();
	},
};

export function createFocusScope<T extends HTMLElement>(
	props: CreateFocusScopeProps,
	ref: Accessor<T | undefined>,
) {
	const [isPaused, setIsPaused] = createSignal(false);

	const focusScope: FocusScopeAPI = {
		pause() {
			setIsPaused(true);
		},
		resume() {
			setIsPaused(false);
		},
	};

	let lastFocusedElement: HTMLElement | null = null;
	const onMountAutoFocus = (e: Event) => props.onMountAutoFocus?.(e);
	const onUnmountAutoFocus = (e: Event) => props.onUnmountAutoFocus?.(e);
	const ownerDocument = () => getDocument(ref());

	const createSentinel = () => {
		const element = ownerDocument().createElement("span");
		element.setAttribute("data-focus-trap", "");
		element.tabIndex = 0;
		Object.assign(element.style, visuallyHiddenStyles);
		return element;
	};

	const tabbables = () => {
		const container = ref();

		if (!container) {
			return [];
		}

		// Get all tabbable in container excluding focus scope sentinels
		return getAllTabbableIn(container, true).filter(
			(el) => !el.hasAttribute("data-focus-trap"),
		);
	};

	const firstTabbable = () => {
		const items = tabbables();
		return items.length > 0 ? items[0] : null;
	};

	const lastTabbable = () => {
		const items = tabbables();
		return items.length > 0 ? items[items.length - 1] : null;
	};

	const shouldPreventUnmountAutoFocus = () => {
		const container = ref();

		if (!container) {
			return false;
		}

		const activeElement = getActiveElement(container);

		if (!activeElement) {
			return false;
		}

		if (contains(container, activeElement)) {
			return false;
		}

		// Don't autofocus the previously focused element on unmount
		// if a focusable element outside the container is already focused.
		return isFocusable(activeElement);
	};

	// Handle dispatching mount and unmount autofocus events.
	createEffect(() => {
		if (isServer) {
			return;
		}

		const container = ref();

		if (!container) {
			return;
		}

		focusScopeStack.add(focusScope);

		const previouslyFocusedElement = getActiveElement(
			container,
		) as HTMLElement | null;
		const hasFocusedCandidate = contains(container, previouslyFocusedElement);

		if (!hasFocusedCandidate) {
			const mountEvent = new CustomEvent(
				AUTOFOCUS_ON_MOUNT_EVENT,
				EVENT_OPTIONS,
			);

			container.addEventListener(AUTOFOCUS_ON_MOUNT_EVENT, onMountAutoFocus);
			container.dispatchEvent(mountEvent);

			if (!mountEvent.defaultPrevented) {
				// Delay the focusing because it may run before a `DismissableLayer` is added to the layer stack,
				// so it cause nested dismissable layer to open then close instantly.
				setTimeout(() => {
					focusWithoutScrolling(firstTabbable());

					if (getActiveElement(container) === previouslyFocusedElement) {
						focusWithoutScrolling(container);
					}
				}, 0);
			}
		}

		onCleanup(() => {
			container.removeEventListener(AUTOFOCUS_ON_MOUNT_EVENT, onMountAutoFocus);

			setTimeout(() => {
				const unmountEvent = new CustomEvent(
					AUTOFOCUS_ON_UNMOUNT_EVENT,
					EVENT_OPTIONS,
				);

				if (shouldPreventUnmountAutoFocus()) {
					unmountEvent.preventDefault();
				}

				container.addEventListener(
					AUTOFOCUS_ON_UNMOUNT_EVENT,
					onUnmountAutoFocus,
				);
				container.dispatchEvent(unmountEvent);

				if (!unmountEvent.defaultPrevented) {
					focusWithoutScrolling(
						previouslyFocusedElement ?? ownerDocument().body,
					);
				}

				// We need to remove the listener after we `dispatchEvent`.
				container.removeEventListener(
					AUTOFOCUS_ON_UNMOUNT_EVENT,
					onUnmountAutoFocus,
				);

				focusScopeStack.remove(focusScope);
			}, 0);
		});
	});

	/*
  // Handle containing focus if a child unmount.
  createEffect(() => {
    if (isServer) {
      return;
    }

    const container = ref();

    if (!container || !access(props.trapFocus)) {
      return;
    }

    const observer = new MutationObserver(([mutation]) => {
      if (!mutation || mutation.target !== container) {
        return;
      }

      if (getActiveElement(container) === ownerDocument().body) {
        focusWithoutScrolling(container);
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    onCleanup(() => {
      observer.disconnect();
    });
  });
  */

	// Handle containing focus if focus is moved outside.
	createEffect(() => {
		if (isServer) {
			return;
		}

		const container = ref();

		if (!container || !access(props.trapFocus) || isPaused()) {
			return;
		}

		const onFocusIn = (event: FocusEvent) => {
			const target = event.target as HTMLElement | null;

			// If the element is within a top layer element (e.g. toasts), always allow moving focus there.
			if (target?.closest(`[${DATA_TOP_LAYER_ATTR}]`)) {
				return;
			}

			if (contains(container, target)) {
				lastFocusedElement = target;
			} else {
				focusWithoutScrolling(lastFocusedElement);
			}
		};

		const onFocusOut = (event: FocusEvent) => {
			const relatedTarget = event.relatedTarget as HTMLElement | null;
			const target = relatedTarget ?? getActiveElement(container);

			// If the element is within a top layer element (e.g. toasts), always allow moving focus there.
			if (target?.closest(`[${DATA_TOP_LAYER_ATTR}]`)) {
				return;
			}

			if (!contains(container, target)) {
				focusWithoutScrolling(lastFocusedElement);
			}
		};

		ownerDocument().addEventListener("focusin", onFocusIn);
		ownerDocument().addEventListener("focusout", onFocusOut);

		onCleanup(() => {
			ownerDocument().removeEventListener("focusin", onFocusIn);
			ownerDocument().removeEventListener("focusout", onFocusOut);
		});
	});

	// Handle looping focus (when tabbing whilst at the edges)
	createEffect(() => {
		if (isServer) {
			return;
		}

		const container = ref();

		if (!container || !access(props.trapFocus) || isPaused()) {
			return;
		}

		const startSentinel = createSentinel();
		container.insertAdjacentElement("afterbegin", startSentinel);

		const endSentinel = createSentinel();
		container.insertAdjacentElement("beforeend", endSentinel);

		function onFocus(event: FocusEvent) {
			const first = firstTabbable();
			const last = lastTabbable();

			if (event.relatedTarget === first) {
				focusWithoutScrolling(last);
			} else {
				focusWithoutScrolling(first);
			}
		}

		startSentinel.addEventListener("focusin", onFocus);
		endSentinel.addEventListener("focusin", onFocus);

		// Ensure sentinels are always the edges of the container.
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.previousSibling === endSentinel) {
					endSentinel.remove();
					container.insertAdjacentElement("beforeend", endSentinel);
				}

				if (mutation.nextSibling === startSentinel) {
					startSentinel.remove();
					container.insertAdjacentElement("afterbegin", startSentinel);
				}
			}
		});

		observer.observe(container, { childList: true, subtree: false });

		onCleanup(() => {
			startSentinel.removeEventListener("focusin", onFocus);
			endSentinel.removeEventListener("focusin", onFocus);
			startSentinel.remove();
			endSentinel.remove();
			observer.disconnect();
		});
	});
}
