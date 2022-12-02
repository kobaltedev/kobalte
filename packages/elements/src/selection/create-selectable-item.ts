/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/8f2f2acb3d5850382ebe631f055f88c704aa7d17/packages/@react-aria/selection/src/useSelectableItem.ts
 */

import { access, combineProps, MaybeAccessor } from "@kobalte/utils";
import { Accessor, createEffect, createMemo, JSX, mergeProps, on } from "solid-js";

import { createPress, CreatePressProps, focusSafely, PointerType, PressEvent } from "../primitives";
import { MultipleSelectionManager } from "./types";
import { isCtrlKeyPressed, isNonContiguousSelectionModifier } from "./utils";

// TODO: Create a component instead

export interface CreateSelectableItemProps {
  /** An interface for reading and updating multiple selection state. */
  selectionManager: MaybeAccessor<MultipleSelectionManager>;

  /** A unique key for the item. */
  key: MaybeAccessor<string>;

  /**
   * By default, selection occurs on pointer down. This can be strange if selecting an
   * item causes the UI to disappear immediately (e.g. menus).
   */
  shouldSelectOnPressUp?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether selection requires the pointer/mouse down and up events to occur on the same target or triggers selection on
   * the target of the pointer/mouse up event.
   */
  allowsDifferentPressOrigin?: MaybeAccessor<boolean | undefined>;

  /** Whether the option is contained in a virtual scroller. */
  isVirtualized?: MaybeAccessor<boolean | undefined>;

  /** Whether the option should use virtual focus instead of being focused directly. */
  shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;

  /** Whether the item is disabled. */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /** Function to focus the item. */
  focus?: () => void;

  /**
   * Handler that is called when a user performs an action on the item.
   * The exact user event depends on the collection's `selectionBehavior` prop and the interaction modality.
   */
  onAction?: () => void;
}

export interface SelectableItemStates {
  /** Whether the item is currently in a pressed state. */
  isPressed: Accessor<boolean>;

  /** Whether the item is currently selected. */
  isSelected: Accessor<boolean>;

  /**
   * Whether the item is non-interactive, i.e. both selection and actions are disabled and the item may
   * not be focused. Dependent on `disabledKeys` and `disabledBehavior`.
   */
  isDisabled: Accessor<boolean>;

  /**
   * Whether the item may be selected,
   * dependent on `selectionMode`, `disabledKeys`, and `disabledBehavior`.
   */
  allowsSelection: Accessor<boolean>;

  /**
   * Whether the item has an action, dependent on `onAction`, `disabledKeys`,
   * and `disabledBehavior. It may also change depending on the current selection state
   * of the list (e.g. when selection is primary). This can be used to enable or disable hover
   * styles or other visual indications of interactivity.
   */
  hasAction: Accessor<boolean>;
}

export interface SelectableItemAria<T extends HTMLElement> extends SelectableItemStates {
  /** Props to be spread on the item root node. */
  itemProps: JSX.HTMLAttributes<T>;
}

/**
 * Handles interactions with an item in a selectable collection.
 * @param props Props for the item.
 * @param ref Ref to the item.
 */
export function createSelectableItem<T extends HTMLElement>(
  props: CreateSelectableItemProps,
  ref: Accessor<T | undefined>
): SelectableItemAria<T> {
  const manager = () => access(props.selectionManager);
  const key = () => access(props.key);
  const shouldUseVirtualFocus = () => access(props.shouldUseVirtualFocus);

  const onSelect = (e: PressEvent | PointerEvent) => {
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

  const allowsActions = () => props.onAction != null && !isDisabled();

  const hasPrimaryAction = () => {
    return (
      allowsActions() &&
      (manager().selectionBehavior() === "replace" ? !allowsSelection() : manager().isEmpty())
    );
  };

  const hasSecondaryAction = () => {
    return allowsActions() && allowsSelection() && manager().selectionBehavior() === "replace";
  };

  const hasAction = () => hasPrimaryAction() || hasSecondaryAction();

  let modality: PointerType | null = null;
  let hadPrimaryActionOnPressStart = false;

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

      if (access(props.shouldSelectOnPressUp)) {
        if (e.pointerType === "keyboard" && (!hasAction() || isSelectionKey())) {
          onSelect(e);
        }
      } else {
        hadPrimaryActionOnPressStart = hasPrimaryAction();

        // Select on mouse down unless there is a primary action which will occur on mouse up.
        // For keyboard, select on key down. If there is an action, the Space key selects on key down,
        // and the Enter key performs onAction on key up.
        if (
          (e.pointerType === "mouse" && !hasPrimaryAction()) ||
          (e.pointerType === "keyboard" && (!props.onAction || isSelectionKey()))
        ) {
          onSelect(e);
        }
      }
    },
    onPressUp: e => {
      // If allowsDifferentPressOrigin, make selection happen on pressUp (e.g. open menu on press down, selection on menu item happens on press up.)
      // Otherwise, have selection happen onPress (prevents listview row selection when clicking on interactable elements in the row)
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
        if (!access(props.allowsDifferentPressOrigin)) {
          if (hasPrimaryAction() || (hasSecondaryAction() && e.pointerType !== "mouse")) {
            if (e.pointerType === "keyboard" && !isActionKey()) {
              return;
            }

            props.onAction?.();
          } else if (e.pointerType !== "keyboard") {
            onSelect(e);
          }
        } else {
          if (hasPrimaryAction()) {
            props.onAction?.();
          }
        }
      } else {
        // Selection occurs on touch up. Primary actions always occur on pointer up.
        // Both primary and secondary actions occur on Enter key up. The only exception
        // is secondary actions, which occur on double click with a mouse.
        if (
          e.pointerType === "touch" ||
          e.pointerType === "pen" ||
          e.pointerType === "virtual" ||
          (e.pointerType === "keyboard" && hasAction() && isActionKey()) ||
          (e.pointerType === "mouse" && hadPrimaryActionOnPressStart)
        ) {
          if (hasAction()) {
            props.onAction?.();
          } else {
            onSelect(e);
          }
        }
      }
    },
  };

  const { pressHandlers, isPressed } = createPress({
    isDisabled: () => !allowsSelection() && !hasPrimaryAction(),
    onPressStart: itemPressProps.onPressStart,
    onPressUp: itemPressProps.onPressUp,
    onPress: itemPressProps.onPress,
    preventFocusOnPress: shouldUseVirtualFocus,
  });

  // Double-clicking with a mouse with selectionBehavior = 'replace' performs an action.
  const onDblClick = (e: Event) => {
    if (!hasSecondaryAction()) {
      return;
    }

    if (modality === "mouse") {
      e.stopPropagation();
      e.preventDefault();
      props.onAction?.();
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

  const baseItemProps: JSX.HTMLAttributes<T> & { "data-key"?: string } = {
    // Set tabIndex to 0 if the element is focused, or -1 otherwise so that only the last focused
    // item is tabbable. If using virtual focus, don't set a tabIndex at all so that VoiceOver
    // on iOS 14 doesn't try to move real DOM focus to the item anyway.
    get tabIndex() {
      if (shouldUseVirtualFocus()) {
        return undefined;
      }

      return key() === manager().focusedKey() ? 0 : -1;
    },
    get "data-key"() {
      return access(props.isVirtualized) ? undefined : key();
    },
  };

  const itemProps = createMemo(() => {
    return combineProps(
      baseItemProps,
      allowsSelection() || hasPrimaryAction() ? pressHandlers : {},
      {
        onDblClick,
        onFocus,
      }
    ) as JSX.HTMLAttributes<T>;
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
    itemProps: mergeProps(itemProps),
    isPressed,
    isSelected,
    isDisabled,
    allowsSelection,
    hasAction,
  };
}

function isActionKey() {
  const event = window.event as KeyboardEvent;
  return event?.key === "Enter";
}

function isSelectionKey() {
  const event = window.event as KeyboardEvent;
  return event?.key === " " || event?.code === "Space";
}
