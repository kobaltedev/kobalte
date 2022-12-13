import {
  combineProps,
  createGenerateId,
  createPolymorphicComponent,
  mergeDefaultProps,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useDialogContext } from "../dialog";
import {
  createFocusRing,
  createHover,
  createPress,
  createRegisterId,
  isKeyboardFocusVisible,
} from "../primitives";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { createSelectableItem } from "../selection";
import { useMenuContext, useOptionalMenuContext } from "./menu-context";
import { MenuItemContext, MenuItemContextValue, MenuItemDataSet } from "./menu-item.context";
import { MenuItemModel } from "./types";

export interface MenuItemProps {
  /** A unique key for the menu item. */
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
}

export const MenuItem = createPolymorphicComponent<"div", MenuItemProps>(props => {
  let ref: HTMLDivElement | undefined;

  const menuContext = useMenuContext();
  const menuSubContext = useOptionalMenuContext();

  const defaultId = `${menuContext.generateId("item")}-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
      closeOnSelect: true,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "key",
    "textValue",
    "isDisabled",
    "closeOnSelect",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();

  const [labelRef, setLabelRef] = createSignal<HTMLElement>();

  const selectionManager = () => menuContext.listState().selectionManager();

  const isFocused = () => selectionManager().focusedKey() === local.key;

  createDomCollectionItem<MenuItemModel>({
    getItem: () => ({
      ref: () => ref,
      key: local.key,
      label: local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? "",
      textValue: local.textValue ?? labelRef()?.textContent ?? ref?.textContent ?? "",
      disabled: local.isDisabled,
    }),
  });

  const {
    tabIndex,
    dataKey,
    pressHandlers: itemPressHandlers,
    otherHandlers: itemOtherHandlers,
  } = createSelectableItem(
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
    onPressStart: e => {
      if (e.pointerType === "keyboard") {
        menuContext.onAction(local.key);
      }
    },
    onPressUp: e => {
      if (e.pointerType !== "keyboard") {
        menuContext.onAction(local.key);

        // Pressing a menu item should close by default, except if overridden by the closeOnSelect prop.
        if (local.closeOnSelect) {
          menuContext.close();
        }
      }
    },
  });

  const { hoverHandlers, isHovered } = createHover({
    isDisabled: () => local.isDisabled,
    onHoverStart: () => {
      if (!isKeyboardFocusVisible()) {
        selectionManager().setFocused(true);
        selectionManager().setFocusedKey(local.key);
      }
    },
  });

  const { isFocusVisible, focusRingHandlers } = createFocusRing();

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    // Ignore repeating events, which may have started on the menu trigger before moving
    // focus to the menu item. We want to wait for a second complete key press sequence.
    if (e.repeat) {
      return;
    }

    switch (e.key) {
      case " ":
        if (
          !local.isDisabled &&
          selectionManager().selectionMode() === "none" &&
          local.closeOnSelect !== false
        ) {
          menuContext.close();
        }
        break;
      case "Enter":
        // The Enter key should always close on select, except if overridden.
        if (!local.isDisabled && local.closeOnSelect !== false) {
          menuContext.close();
        }
        break;
      case "ArrowLeft":
        // The Arrow Left key should always close if it's a sub menu.
        if (!local.isDisabled && menuSubContext !== undefined) {
          menuContext.close();
        }
        break;
    }
  };

  const dataset: Accessor<MenuItemDataSet> = createMemo(() => ({
    "data-disabled": local.isDisabled ? "" : undefined,
    "data-hover": isHovered() ? "" : undefined,
    "data-focus": isFocused() ? "" : undefined,
    "data-focus-visible": isFocusVisible() ? "" : undefined,
    "data-active": isPressed() ? "" : undefined,
  }));

  const context: MenuItemContextValue = {
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
        role="menuitem"
        tabIndex={tabIndex()}
        aria-disabled={local.isDisabled}
        aria-labelledby={labelId()}
        aria-describedby={descriptionId()}
        data-key={dataKey()}
        {...dataset()}
        {...combineProps(
          { ref: el => (ref = el) },
          others,
          itemPressHandlers,
          itemOtherHandlers,
          pressHandlers,
          hoverHandlers,
          focusRingHandlers,
          { onKeyDown }
        )}
      />
    </MenuItemContext.Provider>
  );
});
