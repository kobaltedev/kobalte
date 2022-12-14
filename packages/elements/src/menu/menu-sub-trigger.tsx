/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuSubTrigger.ts
 */

import { combineProps, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, createMemo, JSX, onCleanup, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useHoverCardContext } from "../hover-card/hover-card-context";
import { createFocusRing, createHover, createPress, isKeyboardFocusVisible } from "../primitives";
import { createSelectableItem } from "../selection";
import { useMenuContext } from "./menu-context";

export interface MenuSubTriggerProps {
  /**
   * A unique key for the sub menu trigger.
   * This is needed since the sub menu trigger is also a menu item of its parent menu.
   */
  key: string;

  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the Menu.SubTrigger.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the sub menu trigger is disabled. */
  isDisabled?: boolean;
}

/**
 * An item that opens a submenu.
 */
export const MenuSubTrigger = createPolymorphicComponent<"div", MenuSubTriggerProps>(props => {
  let ref: HTMLDivElement | undefined;

  const hoverCardContext = useHoverCardContext();
  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("sub-trigger"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id", "key", "textValue", "isDisabled"]);

  const selectionManager = createMemo(() => {
    const parentMenuContext = context.parentMenuContext();

    if (parentMenuContext == null) {
      throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");
    }

    return parentMenuContext.listState().selectionManager();
  });

  const isFocused = () => selectionManager().focusedKey() === local.key;

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
    onPress: e => {
      if (e.pointerType === "touch" && !context.isOpen() && !local.isDisabled) {
        context.open();
      }
    },
  });

  const { hoverHandlers, isHovered } = createHover({
    isDisabled: () => local.isDisabled,
    onHoverStart: e => {
      if (!isKeyboardFocusVisible()) {
        selectionManager().setFocused(true);
        selectionManager().setFocusedKey(local.key);
      }

      if (e.pointerType === "touch") {
        return;
      }

      if (!context.isOpen()) {
        context.open();
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

    if (local.isDisabled) {
      return;
    }

    // For consistency with native, open the menu on key down.
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowRight":
        e.stopPropagation();
        e.preventDefault();
        if (context.isOpen()) {
          context.focusInPanel();
        } else {
          context.open("first");
        }
        break;
      case "ArrowLeft":
        // The Arrow Left key should always close if the sub menu trigger is itself in a sub menu.
        if (context.parentMenuContext()?.parentMenuContext() != null) {
          context.parentMenuContext()?.close();
        }
        break;
    }
  };

  const onBlur: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    const relatedTarget = e.relatedTarget as Node | undefined;

    // Don't close if the menu panel (hovercard element) or nested ones has focus within.
    if (hoverCardContext.isTargetOnHoverCard(relatedTarget)) {
      return;
    }

    context.close();
  };

  createEffect(() => onCleanup(context.registerTrigger(local.id!)));

  createEffect(() => {
    if (local.isDisabled) {
      return;
    }

    // Not able to register the trigger as a menu item on parent menu means
    // `Menu.SubTrigger` is not used in the correct place, so throw an error.
    if (context.registerItemToParentDomCollection == null) {
      throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");
    }

    // Register the item trigger on the parent menu that contains it.
    const unregister = context.registerItemToParentDomCollection({
      ref: () => ref,
      key: local.key,
      label: local.textValue ?? ref?.textContent ?? "",
      textValue: local.textValue ?? ref?.textContent ?? "",
      disabled: local.isDisabled,
    });

    onCleanup(unregister);
  });

  return (
    <Dynamic
      component={local.as}
      id={local.id}
      role="menuitem"
      tabIndex={tabIndex()}
      aria-haspopup="true"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.panelId() : undefined}
      aria-disabled={local.isDisabled}
      data-key={dataKey()}
      data-expanded={context.isOpen() ? "" : undefined}
      data-disabled={local.isDisabled ? "" : undefined}
      data-hover={isHovered() ? "" : undefined}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      data-active={isPressed() ? "" : undefined}
      {...combineProps(
        {
          ref: el => {
            context.setTriggerRef(el);
            ref = el;
          },
        },
        others,
        itemPressHandlers,
        itemOtherHandlers,
        pressHandlers,
        hoverHandlers,
        focusRingHandlers,
        { onKeyDown, onBlur }
      )}
    />
  );
});
