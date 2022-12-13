/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuSubTrigger.ts
 */

import {
  callHandler,
  combineProps,
  createPolymorphicComponent,
  mergeDefaultProps,
} from "@kobalte/utils";
import { createEffect, createMemo, JSX, onCleanup, splitProps } from "solid-js";

import { createHoverCardTrigger } from "../hover-card/create-hover-card-trigger";
import { createFocusRing, createHover, createPress, isKeyboardFocusVisible } from "../primitives";
import { useMenuContext } from "./menu-context";
import { createDomCollectionItem } from "../primitives/create-dom-collection";
import { MenuItemModel } from "./types";
import { createSelectableItem } from "../selection";
import { Dynamic } from "solid-js/web";
import { useMenuSubContext } from "./menu-sub-context";

export interface MenuSubTriggerProps {
  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the Menu.SubTrigger.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the menu sub trigger is disabled. */
  isDisabled?: boolean;
}

export const MenuSubTrigger = createPolymorphicComponent<"div", MenuSubTriggerProps>(props => {
  let ref: HTMLDivElement | undefined;

  const context = useMenuContext();
  const menuSubContext = useMenuSubContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: context.generateId("sub-trigger"),
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "id", "textValue", "isDisabled"]);

  const selectionManager = () => menuSubContext.parentContext().listState().selectionManager();

  const isDisabled = () => local.isDisabled || context.isDisabled();
  const isFocused = () => selectionManager().focusedKey() === menuSubContext.triggerKey();

  const {
    tabIndex,
    dataKey,
    pressHandlers: itemPressHandlers,
    otherHandlers: itemOtherHandlers,
  } = createSelectableItem(
    {
      key: menuSubContext.triggerKey,
      selectionManager: selectionManager,
      shouldSelectOnPressUp: true,
      allowsDifferentPressOrigin: true,
      isDisabled,
    },
    () => ref
  );

  const { pressHandlers, isPressed } = createPress({
    isDisabled,
    onPress: e => {
      if (e.pointerType === "touch" && !context.isOpen() && !isDisabled()) {
        context.open();
      }
    },
  });

  const { hoverHandlers, isHovered } = createHover({
    isDisabled,
    onHoverStart: () => {
      if (!isKeyboardFocusVisible()) {
        selectionManager().setFocused(true);
        selectionManager().setFocusedKey(menuSubContext.triggerKey());
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

    if (isDisabled()) {
      return;
    }

    // For consistency with native, open the menu on key down.
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowRight":
        e.stopPropagation();
        e.preventDefault();
        context.toggle("first");
        break;
    }
  };

  createEffect(() => onCleanup(context.registerTrigger(local.id!)));

  createEffect(() => {
    if (isDisabled()) {
      return;
    }

    const unregister = menuSubContext.registerSubTriggerToParent({
      ref: () => ref,
      key: menuSubContext.triggerKey(),
      label: local.textValue ?? ref?.textContent ?? "",
      textValue: local.textValue ?? ref?.textContent ?? "",
      disabled: isDisabled(),
    });

    onCleanup(unregister);
  });

  //const { triggerHandlers: hoverCardTriggerHandlers } = createHoverCardTrigger({ isDisabled });

  return (
    <Dynamic
      component={local.as}
      id={local.id}
      role="menuitem"
      tabIndex={tabIndex()}
      aria-haspopup="true"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.panelId() : undefined}
      aria-disabled={isDisabled()}
      data-key={dataKey()}
      data-expanded={context.isOpen() ? "" : undefined}
      data-disabled={isDisabled() ? "" : undefined}
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
        //hoverCardTriggerHandlers,
        itemPressHandlers,
        itemOtherHandlers,
        pressHandlers,
        hoverHandlers,
        focusRingHandlers,
        { onKeyDown }
      )}
    />
  );
});
