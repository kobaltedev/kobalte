/*!
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
  combineProps,
  createGenerateId,
  createPolymorphicComponent,
  mergeDefaultProps,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  CollectionItem,
  createFocusRing,
  createHover,
  createPress,
  createRegisterId,
  focusSafely,
} from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useMenuContext } from "./menu-context";
import { MenuItemContext, MenuItemContextValue, MenuItemDataSet } from "./menu-item.context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuItemBaseProps {
  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the Menu.ItemLabel part
   * if provided, or fallback to the .textContent of the Menu.Item.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the menu item is disabled. */
  isDisabled?: boolean;

  /** Whether the menu should close when the menu item is activated/selected. */
  closeOnSelect?: boolean;

  /** Event handler called when the user selects an item (via mouse or keyboard). */
  onSelect?: () => void;

  /** Whether the menu item is checked (item radio or item checkbox). */
  isChecked?: boolean;

  /**
   * When using menu item checkbox, whether the checked state is in an indeterminate mode.
   * Indeterminism is presentational only.
   * The indeterminate visual representation remains regardless of user interaction.
   */
  isIndeterminate?: boolean;
}

/**
 * Base component for a menu item.
 */
export const MenuItemBase = createPolymorphicComponent<"div", MenuItemBaseProps>(props => {
  let ref: HTMLDivElement | undefined;

  const rootContext = useMenuRootContext();
  const menuContext = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: rootContext.generateId(`item-${createUniqueId()}`),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "textValue",
    "isDisabled",
    "closeOnSelect",
    "onSelect",
    "isChecked",
    "isIndeterminate",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [labelRef, setLabelRef] = createSignal<HTMLElement>();

  const selectionManager = () => menuContext.listState().selectionManager();

  const key = () => others.id!;

  const isFocused = () => selectionManager().focusedKey() === key();

  const onSelect = () => {
    local.onSelect?.();

    if (local.closeOnSelect) {
      rootContext.close();
    }
  };

  createDomCollectionItem<CollectionItem>({
    getItem: () => ({
      ref: () => ref,
      key: key(),
      label: "", // not applicable here
      textValue: local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? "",
      isDisabled: local.isDisabled ?? false,
    }),
  });

  const selectableItem = createSelectableItem(
    {
      key,
      selectionManager: selectionManager,
      shouldSelectOnPressUp: true,
      allowsDifferentPressOrigin: true,
      isDisabled: () => local.isDisabled,
    },
    () => ref
  );

  const { isFocusVisible, focusRingHandlers } = createFocusRing();

  const { pressHandlers, isPressed } = createPress({
    isDisabled: () => local.isDisabled,
    onPressUp: e => {
      if (e.pointerType !== "keyboard") {
        onSelect();
      }
    },
  });

  const { hoverHandlers, isHovered } = createHover({
    isDisabled: () => local.isDisabled,
  });

  /**
   * We focus items on `pointerMove` to achieve the following:
   *
   * - Mouse over an item (it focuses)
   * - Leave mouse where it is and use keyboard to focus a different item
   * - Wiggle mouse without it leaving previously focused item
   * - Previously focused item should re-focus
   *
   * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
   * wiggles. This is to match native menu implementation.
   */
  const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (e.pointerType !== "mouse") {
      return;
    }

    if (local.isDisabled) {
      menuContext.onItemLeave(e);
    } else {
      menuContext.onItemEnter(e);

      if (!e.defaultPrevented) {
        focusSafely(e.currentTarget);
        menuContext.listState().selectionManager().setFocused(true);
        menuContext.listState().selectionManager().setFocusedKey(key());
      }
    }
  };

  const onPointerLeave: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (e.pointerType !== "mouse") {
      return;
    }

    menuContext.onItemLeave(e);
  };

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    // Ignore repeating events, which may have started on the menu trigger before moving
    // focus to the menu item. We want to wait for a second complete key press sequence.
    if (e.repeat) {
      return;
    }

    if (local.isDisabled) {
      return;
    }

    switch (e.key) {
      case "Enter":
      case " ":
        onSelect();
        break;
    }
  };

  const ariaChecked = createMemo(() => {
    if (local.isIndeterminate) {
      return "mixed";
    }

    if (local.isChecked == null) {
      return undefined;
    }

    return local.isChecked;
  });

  const dataset: Accessor<MenuItemDataSet> = createMemo(() => ({
    "data-indeterminate": local.isIndeterminate ? "" : undefined,
    "data-checked": local.isChecked && !local.isIndeterminate ? "" : undefined,
    "data-disabled": local.isDisabled ? "" : undefined,
    "data-hover": isHovered() ? "" : undefined,
    "data-focus": isFocused() ? "" : undefined,
    "data-focus-visible": isFocusVisible() ? "" : undefined,
    "data-active": isPressed() ? "" : undefined,
  }));

  const context: MenuItemContextValue = {
    isChecked: () => local.isChecked,
    dataset,
    setLabelRef,
    generateId: createGenerateId(() => others.id!),
    registerLabel: createRegisterId(setLabelId),
    registerDescription: createRegisterId(setDescriptionId),
  };

  return (
    <MenuItemContext.Provider value={context}>
      <Dynamic
        component={local.as}
        tabIndex={selectableItem.tabIndex()}
        aria-checked={ariaChecked()}
        aria-disabled={local.isDisabled}
        aria-labelledby={labelId()}
        aria-describedby={descriptionId()}
        data-key={selectableItem.dataKey()}
        {...dataset()}
        {...combineProps(
          { ref: el => (ref = el) },
          others,
          selectableItem.pressHandlers,
          selectableItem.longPressHandlers,
          selectableItem.otherHandlers,
          pressHandlers,
          hoverHandlers,
          focusRingHandlers,
          { onPointerMove, onPointerLeave, onKeyDown }
        )}
      />
    </MenuItemContext.Provider>
  );
});
