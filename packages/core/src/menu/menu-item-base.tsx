import {
  combineProps,
  createGenerateId,
  createPolymorphicComponent,
  getActiveElement,
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
} from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useMenuContext } from "./menu-context";
import { MenuItemContext, MenuItemContextValue, MenuItemDataSet } from "./menu-item.context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuItemBaseProps {
  /**
   * A unique key for the menu item.
   * It must be unique across the entire `Menu` tree (including sub menus, checkbox and radios).
   */
  key: string;

  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the Menu.ItemLabel part
   * if provided, or fallback to the .textContent of the Menu.Item.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the menu item is disabled. */
  isDisabled?: boolean;

  /** Whether the menu should close when the menu item is selected. */
  closeOnSelect?: boolean;

  /** Handler that is called when the user activates the menu item. */
  onAction: (key: string) => void;

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
    "key",
    "textValue",
    "isDisabled",
    "closeOnSelect",
    "onAction",
    "isChecked",
    "isIndeterminate",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [labelRef, setLabelRef] = createSignal<HTMLElement>();

  const selectionManager = () => menuContext.listState().selectionManager();

  const isFocused = () => selectionManager().focusedKey() === local.key;

  createDomCollectionItem<CollectionItem>({
    getItem: () => ({
      ref: () => ref,
      key: local.key,
      label: "", // not applicable here
      textValue: local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? "",
      isDisabled: local.isDisabled ?? false,
    }),
  });

  const selectableItem = createSelectableItem(
    {
      key: () => local.key,
      selectionManager: selectionManager,
      shouldSelectOnPressUp: true,
      allowsDifferentPressOrigin: true,
      isDisabled: () => local.isDisabled,
    },
    () => ref
  );

  const { pressHandlers, isPressed } = createPress({
    isDisabled: () => local.isDisabled,
    onPressUp: e => {
      if (e.pointerType !== "keyboard") {
        local.onAction(local.key);

        if (local.closeOnSelect) {
          rootContext.close();
        }
      }
    },
  });

  const { hoverHandlers, isHovered } = createHover({
    isDisabled: () => local.isDisabled,
    onHoverStart: () => {
      menuContext.clearFocusContentTimeout();

      if (menuContext.isPointerSuspended()) {
        return;
      }

      menuContext.focusContent(local.key);
    },
    onHoverEnd: () => {
      if (menuContext.isPointerSuspended()) {
        return;
      }

      menuContext.focusContentWithDelay(undefined);
    },
  });

  const { isFocusVisible, focusRingHandlers } = createFocusRing();

  const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (menuContext.isPointerSuspended()) {
      e.preventDefault();
      return;
    }

    if (e.pointerType !== "mouse" || local.isDisabled) {
      return;
    }

    // For consistency with native menu implementation re-focus when the mouse wiggles.
    if (selectionManager().focusedKey() !== local.key) {
      menuContext.focusContent(local.key);
    }
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
        local.onAction(local.key);

        if (local.closeOnSelect) {
          rootContext.close();
        }

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
          { onPointerMove, onKeyDown }
        )}
      />
    </MenuItemContext.Provider>
  );
});
