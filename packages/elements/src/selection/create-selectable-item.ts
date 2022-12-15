/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableItem.ts
 */

import { access, isActionKey, isSelectionKey, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, createMemo, on } from "solid-js";

import {
  CollectionKey,
  createLongPress,
  createPress,
  CreatePressProps,
  focusSafely,
  PointerType,
  PressEvent,
} from "../primitives";
import { MultipleSelectionManager } from "./types";
import { isCtrlKeyPressed, isNonContiguousSelectionModifier } from "./utils";
import { LongPressEvent } from "../primitives/create-long-press/types";

export interface CreateSelectableItemProps {
  /** An interface for reading and updating multiple selection state. */
  selectionManager: MaybeAccessor<MultipleSelectionManager>;

  /** A unique key for the item. */
  key: MaybeAccessor<CollectionKey>;

  /**
   * By default, selection occurs on pointer down. This can be strange if selecting an
   * item causes the UI to disappear immediately (e.g. menus).
   */
  shouldSelectOnPressUp?: MaybeAccessor<boolean | undefined>;

  /** Whether the option should use virtual focus instead of being focused directly. */
  shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether selection requires the pointer/mouse down and up events to occur on the same target or triggers selection on
   * the target of the pointer/mouse up event.
   */
  allowsDifferentPressOrigin?: MaybeAccessor<boolean | undefined>;

  /** Whether the option is contained in a virtual scroller. */
  isVirtualized?: MaybeAccessor<boolean | undefined>;

  /** Whether the item is disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /** Function to focus the item. */
  focus?: () => void;
}

/**
 * Handles interactions with an item in a selectable collection.
 * @param props Props for the item.
 * @param ref Ref to the item.
 */
export function createSelectableItem<T extends HTMLElement>(
  props: CreateSelectableItemProps,
  ref: Accessor<T | undefined>
) {
  const manager = () => access(props.selectionManager);
  const key = () => access(props.key);
  const shouldUseVirtualFocus = () => access(props.shouldUseVirtualFocus);

  const onSelect = (e: PressEvent | LongPressEvent | PointerEvent) => {
    if (e.pointerType === "keyboard" && isNonContiguousSelectionModifier(e)) {
      manager().toggleSelection(key());
    } else {
      if (manager().selectionMode() === "none") {
        return;
      }

      if (manager().selectionMode() === "single") {
        if (manager().isSelected(key()) && !manager().disallowEmptySelection()) {
          manager().toggleSelection(key());
        } else {
          manager().replaceSelection(key());
        }
      } else if (e && e.shiftKey) {
        manager().extendSelection(key());
      } else if (
        manager().selectionBehavior() === "toggle" ||
        (e && (isCtrlKeyPressed(e) || e.pointerType === "touch" || e.pointerType === "virtual"))
      ) {
        // if touch or virtual then we just want to toggle, otherwise it's impossible to multi select because they don't have modifier keys
        manager().toggleSelection(key());
      } else {
        manager().replaceSelection(key());
      }
    }
  };

  const isSelected = () => manager().isSelected(key());

  // With checkbox selection, onAction (i.e. navigation) becomes primary, and occurs on a single click of the row.
  // Clicking the checkbox enters selection mode, after which clicking anywhere on any row toggles selection for that row.
  // With highlight selection, onAction is secondary, and occurs on double click. Single click selects the row.
  // With touch, onAction occurs on single tap, and long press enters selection mode.
  const isDisabled = () => access(props.isDisabled) || manager().isDisabled(key());

  const allowsSelection = () => !isDisabled() && manager().canSelectItem(key());

  let modality: PointerType | null = null;

  let longPressEnabledOnPressStart = false;

  // By default, selection occurs on pointer down. This can be strange if selecting an
  // item causes the UI to disappear immediately (e.g. menus).
  // If shouldSelectOnPressUp is true, we use onPressUp instead of onPressStart.
  // onPress requires a pointer down event on the same element as pointer up. For menus,
  // we want to be able to have the pointer down on the trigger that opens the menu and
  // the pointer up on the menu item rather than requiring a separate press.
  // For keyboard events, selection still occurs on key down.
  const itemPressProps: CreatePressProps = {
    onPressStart: e => {
      modality = e.pointerType;
      longPressEnabledOnPressStart = allowsSelection();

      // Selection occurs on mouse down or key down (Enter or Space bar).
      if (
        (e.pointerType === "mouse" && !access(props.shouldSelectOnPressUp)) ||
        (e.pointerType === "keyboard" && (isActionKey() || isSelectionKey()))
      ) {
        onSelect(e);
      }
    },
    onPressUp: e => {
      // If allowsDifferentPressOrigin, make selection happen on pressUp.
      // Otherwise, have selection happen onPress
      if (
        access(props.shouldSelectOnPressUp) &&
        access(props.allowsDifferentPressOrigin) &&
        e.pointerType !== "keyboard"
      ) {
        onSelect(e);
      }
    },
    onPress: e => {
      if (access(props.shouldSelectOnPressUp)) {
        if (!access(props.allowsDifferentPressOrigin) && e.pointerType !== "keyboard") {
          onSelect(e);
        }
      } else {
        // Selection occurs on touch up.
        if (e.pointerType === "touch" || e.pointerType === "pen" || e.pointerType === "virtual") {
          onSelect(e);
        }
      }
    },
  };

  const { pressHandlers, isPressed } = createPress({
    isDisabled: () => !allowsSelection(),
    onPressStart: itemPressProps.onPressStart,
    onPressUp: itemPressProps.onPressUp,
    onPress: itemPressProps.onPress,
    preventFocusOnPress: shouldUseVirtualFocus,
  });

  // Long pressing an item with touch when selectionBehavior = 'replace' switches the selection behavior
  // to 'toggle'. This changes the single tap behavior from performing an action (i.e. navigating) to
  // selecting, and may toggle the appearance of a UI affordance like checkboxes on each item.
  const { longPressHandlers } = createLongPress({
    isDisabled: () => !allowsSelection(),
    onLongPress: e => {
      if (e.pointerType === "touch") {
        onSelect(e);
        manager().setSelectionBehavior("toggle");
      }
    },
  });

  // Prevent native drag and drop on long press if we also select on long press.
  // Once the user is in selection mode, they can long press again to drag.
  const onDragStart = (e: Event) => {
    if (modality === "touch" && longPressEnabledOnPressStart) {
      e.preventDefault();
    }
  };

  const onFocus = (e: FocusEvent) => {
    const refEl = ref();

    if (shouldUseVirtualFocus() || !refEl) {
      return;
    }

    if (e.target === refEl) {
      manager().setFocusedKey(key());
    }
  };

  // Set tabIndex to 0 if the element is focused,
  // or -1 otherwise so that only the last focused item is tabbable.
  // If using virtual focus, don't set a tabIndex at all so that VoiceOver
  // on iOS 14 doesn't try to move real DOM focus to the item anyway.
  const tabIndex = createMemo(() => {
    if (shouldUseVirtualFocus()) {
      return undefined;
    }

    return key() === manager().focusedKey() ? 0 : -1;
  });

  // data-attribute used in selection manager and keyboard delegate
  const dataKey = createMemo(() => {
    return access(props.isVirtualized) ? undefined : key();
  });

  // Focus the associated DOM node when this item becomes the focusedKey
  createEffect(
    on(
      [
        ref,
        key,
        shouldUseVirtualFocus,
        () => manager().focusedKey(),
        () => manager().isFocused(),
        () => manager().childFocusStrategy(),
      ],
      newValue => {
        const [refEl, key, shouldUseVirtualFocus, focusedKey, isFocused] = newValue;

        if (
          refEl &&
          key === focusedKey &&
          isFocused &&
          !shouldUseVirtualFocus &&
          document.activeElement !== refEl
        ) {
          if (props.focus) {
            props.focus();
          } else {
            focusSafely(refEl);
          }
        }
      }
    )
  );

  return {
    isPressed,
    isSelected,
    isDisabled,
    allowsSelection,
    tabIndex,
    dataKey,
    pressHandlers,
    longPressHandlers,
    otherHandlers: { onDragStart, onFocus },
  };
}
