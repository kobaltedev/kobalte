/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableCollection.ts
 */

import {
	type MaybeAccessor,
	type Orientation,
	access,
	callHandler,
	createEventListener,
	focusWithoutScrolling,
	getFocusableTreeWalker,
	scrollIntoView,
} from "@kobalte/utils";
import {
	type Accessor,
	type JSX,
	createEffect,
	createMemo,
	mergeProps,
	on,
	onMount,
} from "solid-js";

import { useLocale } from "../i18n";
import { createTypeSelect } from "./create-type-select";
import type {
	FocusStrategy,
	KeyboardDelegate,
	MultipleSelectionManager,
} from "./types";
import { isCtrlKeyPressed, isNonContiguousSelectionModifier } from "./utils";

interface CreateSelectableCollectionProps {
	/** An interface for reading and updating multiple selection state. */
	selectionManager: MaybeAccessor<MultipleSelectionManager>;

	/** A delegate object that implements behavior for keyboard focus movement. */
	keyboardDelegate: MaybeAccessor<KeyboardDelegate>;

	/** Whether the collection or one of its items should be automatically focused upon render. */
	autoFocus?: MaybeAccessor<boolean | FocusStrategy | undefined>;

	/** Whether the autofocus should run on next tick. */
	deferAutoFocus?: MaybeAccessor<boolean | undefined>;

	/** Whether focus should wrap around when the end/start is reached. */
	shouldFocusWrap?: MaybeAccessor<boolean | undefined>;

	/** Whether the collection allows empty selection. */
	disallowEmptySelection?: MaybeAccessor<boolean | undefined>;

	/** Whether the collection allows the user to select all items via keyboard shortcut. */
	disallowSelectAll?: MaybeAccessor<boolean | undefined>;

	/** Whether selection should occur automatically on focus. */
	selectOnFocus?: MaybeAccessor<boolean | undefined>;

	/** Whether typeahead is disabled. */
	disallowTypeAhead?: MaybeAccessor<boolean | undefined>;

	/** Whether the collection items should use virtual focus instead of being focused directly. */
	shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;

	/** Whether navigation through tab key is enabled. */
	allowsTabNavigation?: MaybeAccessor<boolean | undefined>;

	/** Whether the collection items are contained in a virtual scroller. */
	isVirtualized?: MaybeAccessor<boolean | undefined>;

	/** When virtualized, the Virtualizer function used to scroll to the item of the key provided. */
	scrollToKey?: (key: string) => void;

	/** The orientation of the selectable collection interactions. */
	orientation?: MaybeAccessor<Orientation | undefined>;
}

/**
 * Handles interactions with selectable collections.
 * @param props Props for the collection.
 * @param ref The ref attached to the element representing the collection.
 * @param scrollRef The ref attached to the scrollable body. Used to provide automatic scrolling on item focus for non-virtualized collections. If not provided, defaults to the collection ref.
 */
export function createSelectableCollection<
	T extends HTMLElement,
	U extends HTMLElement = T,
>(
	props: CreateSelectableCollectionProps,
	ref: Accessor<T | undefined>,
	scrollRef?: Accessor<U | undefined>,
) {
	const defaultProps: Partial<CreateSelectableCollectionProps> = {
		selectOnFocus: () =>
			access(props.selectionManager).selectionBehavior() === "replace",
	};

	const mergedProps = mergeProps(defaultProps, props);

	const finalScrollRef = () => scrollRef?.() ?? ref();

	const { direction } = useLocale();

	// Store the scroll position, so we can restore it later.
	let scrollPos = { top: 0, left: 0 };
	createEventListener(
		() => (!access(mergedProps.isVirtualized) ? finalScrollRef() : undefined),
		"scroll",
		() => {
			const scrollEl = finalScrollRef();

			if (!scrollEl) {
				return;
			}

			scrollPos = {
				top: scrollEl.scrollTop,
				left: scrollEl.scrollLeft,
			};
		},
	);

	const { typeSelectHandlers } = createTypeSelect({
		isDisabled: () => access(mergedProps.disallowTypeAhead),
		keyboardDelegate: () => access(mergedProps.keyboardDelegate),
		selectionManager: () => access(mergedProps.selectionManager),
	});

	const orientation = () => access(mergedProps.orientation) ?? "vertical";

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, typeSelectHandlers.onKeyDown);

		// Prevent option + tab from doing anything since it doesn't move focus to the cells, only buttons/checkboxes
		if (e.altKey && e.key === "Tab") {
			e.preventDefault();
		}

		const refEl = ref();

		// Keyboard events bubble through portals. Don't handle keyboard events
		// for elements outside the collection (e.g. menus).
		if (!refEl?.contains(e.target as HTMLElement)) {
			return;
		}

		const manager = access(mergedProps.selectionManager);
		const selectOnFocus = access(mergedProps.selectOnFocus);

		const navigateToKey = (key: string | undefined) => {
			if (key != null) {
				manager.setFocusedKey(key);

				if (e.shiftKey && manager.selectionMode() === "multiple") {
					manager.extendSelection(key);
				} else if (selectOnFocus && !isNonContiguousSelectionModifier(e)) {
					manager.replaceSelection(key);
				}
			}
		};

		const delegate = access(mergedProps.keyboardDelegate);
		const shouldFocusWrap = access(mergedProps.shouldFocusWrap);

		const focusedKey = manager.focusedKey();

		switch (e.key) {
			case orientation() === "vertical" ? "ArrowDown" : "ArrowRight": {
				if (delegate.getKeyBelow) {
					e.preventDefault();

					let nextKey: string | undefined;

					if (focusedKey != null) {
						nextKey = delegate.getKeyBelow(focusedKey);
					} else {
						nextKey = delegate.getFirstKey?.();
					}

					if (nextKey == null && shouldFocusWrap) {
						nextKey = delegate.getFirstKey?.(focusedKey);
					}

					navigateToKey(nextKey);
				}
				break;
			}
			case orientation() === "vertical" ? "ArrowUp" : "ArrowLeft": {
				if (delegate.getKeyAbove) {
					e.preventDefault();

					let nextKey: string | undefined;

					if (focusedKey != null) {
						nextKey = delegate.getKeyAbove(focusedKey);
					} else {
						nextKey = delegate.getLastKey?.();
					}

					if (nextKey == null && shouldFocusWrap) {
						nextKey = delegate.getLastKey?.(focusedKey);
					}

					navigateToKey(nextKey);
				}
				break;
			}
			case orientation() === "vertical" ? "ArrowLeft" : "ArrowUp": {
				if (delegate.getKeyLeftOf) {
					e.preventDefault();

					const isRTL = direction() === "rtl";

					let nextKey: string | undefined;

					if (focusedKey != null) {
						nextKey = delegate.getKeyLeftOf(focusedKey);
					} else {
						nextKey = isRTL
							? delegate.getFirstKey?.()
							: delegate.getLastKey?.();
					}

					navigateToKey(nextKey);
				}
				break;
			}
			case orientation() === "vertical" ? "ArrowRight" : "ArrowDown": {
				if (delegate.getKeyRightOf) {
					e.preventDefault();

					const isRTL = direction() === "rtl";

					let nextKey: string | undefined;

					if (focusedKey != null) {
						nextKey = delegate.getKeyRightOf(focusedKey);
					} else {
						nextKey = isRTL
							? delegate.getLastKey?.()
							: delegate.getFirstKey?.();
					}

					navigateToKey(nextKey);
				}
				break;
			}
			case "Home":
				if (delegate.getFirstKey) {
					e.preventDefault();

					const firstKey = delegate.getFirstKey(
						focusedKey,
						isCtrlKeyPressed(e),
					);

					if (firstKey != null) {
						manager.setFocusedKey(firstKey);

						if (
							isCtrlKeyPressed(e) &&
							e.shiftKey &&
							manager.selectionMode() === "multiple"
						) {
							manager.extendSelection(firstKey);
						} else if (selectOnFocus) {
							manager.replaceSelection(firstKey);
						}
					}
				}
				break;
			case "End":
				if (delegate.getLastKey) {
					e.preventDefault();

					const lastKey = delegate.getLastKey(focusedKey, isCtrlKeyPressed(e));

					if (lastKey != null) {
						manager.setFocusedKey(lastKey);

						if (
							isCtrlKeyPressed(e) &&
							e.shiftKey &&
							manager.selectionMode() === "multiple"
						) {
							manager.extendSelection(lastKey);
						} else if (selectOnFocus) {
							manager.replaceSelection(lastKey);
						}
					}
				}
				break;
			case "PageDown":
				if (delegate.getKeyPageBelow && focusedKey != null) {
					e.preventDefault();
					const nextKey = delegate.getKeyPageBelow(focusedKey);
					navigateToKey(nextKey);
				}
				break;
			case "PageUp":
				if (delegate.getKeyPageAbove && focusedKey != null) {
					e.preventDefault();
					const nextKey = delegate.getKeyPageAbove(focusedKey);
					navigateToKey(nextKey);
				}
				break;
			case "a":
				if (
					isCtrlKeyPressed(e) &&
					manager.selectionMode() === "multiple" &&
					access(mergedProps.disallowSelectAll) !== true
				) {
					e.preventDefault();
					manager.selectAll();
				}
				break;
			case "Escape":
				if (!e.defaultPrevented) {
					e.preventDefault();
					if (!access(mergedProps.disallowEmptySelection)) {
						manager.clearSelection();
					}
				}
				break;
			case "Tab": {
				if (!access(mergedProps.allowsTabNavigation)) {
					// There may be elements that are "tabbable" inside a collection (e.g. in a grid cell).
					// However, collections should be treated as a single tab stop, with arrow key navigation internally.
					// We don't control the rendering of these, so we can't override the tabIndex to prevent tabbing.
					// Instead, we handle the Tab key, and move focus manually to the first/last tabbable element
					// in the collection, so that the browser default behavior will apply starting from that element
					// rather than the currently focused one.
					if (e.shiftKey) {
						refEl.focus();
					} else {
						const walker = getFocusableTreeWalker(refEl, { tabbable: true });
						let next: HTMLElement | undefined;
						let last: HTMLElement | undefined;
						do {
							last = walker.lastChild() as HTMLElement;
							if (last) {
								next = last;
							}
						} while (last);

						if (next && !next.contains(document.activeElement)) {
							focusWithoutScrolling(next);
						}
					}
					break;
				}
			}
		}
	};

	const onFocusIn: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		const manager = access(mergedProps.selectionManager);
		const delegate = access(mergedProps.keyboardDelegate);
		const selectOnFocus = access(mergedProps.selectOnFocus);

		if (manager.isFocused()) {
			// If a focus event bubbled through a portal, reset focus state.
			if (!e.currentTarget.contains(e.target)) {
				manager.setFocused(false);
			}

			return;
		}

		// Focus events can bubble through portals. Ignore these events.
		if (!e.currentTarget.contains(e.target)) {
			return;
		}

		manager.setFocused(true);

		if (manager.focusedKey() == null) {
			const navigateToFirstKey = (key: string | undefined) => {
				if (key == null) {
					return;
				}

				manager.setFocusedKey(key);

				if (selectOnFocus) {
					manager.replaceSelection(key);
				}
			};

			// If the user hasn't yet interacted with the collection, there will be no focusedKey set.
			// Attempt to detect whether the user is tabbing forward or backward into the collection
			// and either focus the first or last item accordingly.
			const relatedTarget = e.relatedTarget as Element;
			if (
				relatedTarget &&
				e.currentTarget.compareDocumentPosition(relatedTarget) &
					Node.DOCUMENT_POSITION_FOLLOWING
			) {
				navigateToFirstKey(
					manager.lastSelectedKey() ?? delegate.getLastKey?.(),
				);
			} else {
				navigateToFirstKey(
					manager.firstSelectedKey() ?? delegate.getFirstKey?.(),
				);
			}
		} else if (!access(mergedProps.isVirtualized)) {
			const scrollEl = finalScrollRef();

			if (scrollEl) {
				// Restore the scroll position to what it was before.
				scrollEl.scrollTop = scrollPos.top;
				scrollEl.scrollLeft = scrollPos.left;

				// Refocus and scroll the focused item into view if it exists within the scrollable region.
				const element = scrollEl.querySelector(
					`[data-key="${manager.focusedKey()}"]`,
				);

				if (element) {
					// This prevents a flash of focus on the first/last element in the collection
					focusWithoutScrolling(element as HTMLElement);
					scrollIntoView(scrollEl, element as HTMLElement);
				}
			}
		}
	};

	const onFocusOut: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
		const manager = access(mergedProps.selectionManager);

		// Don't set blurred and then focused again if moving focus within the collection.
		if (!e.currentTarget.contains(e.relatedTarget as HTMLElement)) {
			manager.setFocused(false);
		}
	};

	const onMouseDown: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		// Ignore events that bubbled through portals.
		if (finalScrollRef() === e.target) {
			// Prevent focus going to the collection when clicking on the scrollbar.
			e.preventDefault();
		}
	};

	const tryAutoFocus = () => {
		const autoFocus = access(mergedProps.autoFocus);

		if (!autoFocus) {
			return;
		}

		const manager = access(mergedProps.selectionManager);
		const delegate = access(mergedProps.keyboardDelegate);

		let focusedKey: string | undefined;

		// Check focus strategy to determine which item to focus
		if (autoFocus === "first") {
			focusedKey = delegate.getFirstKey?.();
		}
		if (autoFocus === "last") {
			focusedKey = delegate.getLastKey?.();
		}

		// If there are any selected keys, make the first one the new focus target
		const selectedKeys = manager.selectedKeys();
		if (selectedKeys.size) {
			focusedKey = selectedKeys.values().next().value;
		}

		manager.setFocused(true);
		manager.setFocusedKey(focusedKey);

		const refEl = ref();

		// If no default focus key is selected, focus the collection itself.
		if (
			refEl &&
			focusedKey == null &&
			!access(mergedProps.shouldUseVirtualFocus)
		) {
			focusWithoutScrolling(refEl);
		}
	};

	onMount(() => {
		if (mergedProps.deferAutoFocus) {
			setTimeout(tryAutoFocus, 0); // TODO: does this work EVERY time ?
		} else {
			tryAutoFocus();
		}
	});

	// If not virtualized, scroll the focused element into view when the focusedKey changes.
	// When virtualized, the Virtualizer should handle this.
	createEffect(
		on(
			[
				finalScrollRef,
				() => access(mergedProps.isVirtualized),
				() => access(mergedProps.selectionManager).focusedKey(),
			],
			(newValue) => {
				const [scrollEl, isVirtualized, focusedKey] = newValue;

				if (isVirtualized) {
					focusedKey && mergedProps.scrollToKey?.(focusedKey);
				} else {
					if (focusedKey && scrollEl) {
						const element = scrollEl.querySelector(
							`[data-key="${focusedKey}"]`,
						);

						if (element) {
							scrollIntoView(scrollEl, element as HTMLElement);
						}
					}
				}
			},
		),
	);

	// If nothing is focused within the collection, make the collection itself tabbable.
	// This will be marshalled to either the first or last item depending on where focus came from.
	// If using virtual focus, don't set a tabIndex at all so that VoiceOver on iOS 14 doesn't try
	// to move real DOM focus to the element anyway.
	const tabIndex = createMemo(() => {
		if (access(mergedProps.shouldUseVirtualFocus)) {
			return undefined;
		}

		return access(mergedProps.selectionManager).focusedKey() == null ? 0 : -1;
	});

	return {
		tabIndex,
		onKeyDown,
		onMouseDown,
		onFocusIn,
		onFocusOut,
	};
}
