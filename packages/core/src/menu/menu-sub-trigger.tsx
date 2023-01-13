/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuSubTrigger.ts
 *
 * Portions of this file are based on code from radix-ui-primitives.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the Radix UI team:
 * https://github.com/radix-ui/primitives/blob/81b25f4b40c54f72aeb106ca0e64e1e09655153e/packages/react/menu/src/Menu.tsx
 */

import {
  composeEventHandlers,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, createUniqueId, JSX, on, onCleanup, splitProps } from "solid-js";
import { Dynamic, isServer } from "solid-js/web";

import { Direction, useLocale } from "../i18n";
import {
  createFocusRing,
  createHover,
  createPress,
  FOCUS_RING_HANDLERS_PROP_NAMES,
  focusSafely,
  HOVER_HANDLERS_PROP_NAMES,
  PRESS_HANDLERS_PROP_NAMES,
} from "../primitives";
import { createSelectableItem } from "../selection";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";
import { getPointerGraceArea, Side } from "./utils";

export interface MenuSubTriggerOptions {
  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the .textContent of the Menu.SubTrigger.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;

  /** Whether the sub menu trigger is disabled. */
  isDisabled?: boolean;
}

const SELECTION_KEYS = ["Enter", " "];
const SUB_OPEN_KEYS: Record<Direction, string[]> = {
  ltr: [...SELECTION_KEYS, "ArrowRight"],
  rtl: [...SELECTION_KEYS, "ArrowLeft"],
};

/**
 * An item that opens a submenu.
 */
export const MenuSubTrigger = createPolymorphicComponent<"div", MenuSubTriggerOptions>(props => {
  let ref: HTMLDivElement | undefined;

  const rootContext = useMenuRootContext();
  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      as: "div",
      id: rootContext.generateId(`sub-trigger-${createUniqueId()}`),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "id",
    "textValue",
    "isDisabled",
    "onFocus",
    ...PRESS_HANDLERS_PROP_NAMES,
    ...HOVER_HANDLERS_PROP_NAMES,
    ...FOCUS_RING_HANDLERS_PROP_NAMES,
  ]);

  let openTimeoutId: number | null = null;

  const clearOpenTimeout = () => {
    if (isServer) {
      return;
    }

    if (openTimeoutId) {
      window.clearTimeout(openTimeoutId);
    }

    openTimeoutId = null;
  };

  const { direction } = useLocale();

  const key = () => local.id!;

  const parentSelectionManager = () => {
    const parentMenuContext = context.parentMenuContext();

    if (parentMenuContext == null) {
      throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");
    }

    return parentMenuContext.listState().selectionManager();
  };

  const collection = () => context.listState().collection();

  const isFocused = () => parentSelectionManager().focusedKey() === key();

  const selectableItem = createSelectableItem(
    {
      key,
      selectionManager: parentSelectionManager,
      shouldSelectOnPressUp: true,
      allowsDifferentPressOrigin: true,
      isDisabled: () => local.isDisabled,
    },
    () => ref
  );

  const { isFocusVisible, focusRingHandlers } = createFocusRing();

  const { pressHandlers, isPressed } = createPress({
    isDisabled: () => local.isDisabled,
    onPress: e => {
      if (e.pointerType === "touch" && !context.isOpen() && !local.isDisabled) {
        context.open(true);
      }
    },
  });

  const { hoverHandlers, isHovered } = createHover({
    isDisabled: () => local.isDisabled,
  });

  const onPointerMove: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (e.pointerType !== "mouse") {
      return;
    }

    const parentMenuContext = context.parentMenuContext();

    parentMenuContext?.onItemEnter(e);

    if (e.defaultPrevented) {
      return;
    }

    if (local.isDisabled) {
      parentMenuContext?.onItemLeave(e);
      return;
    }

    if (!context.isOpen() && !openTimeoutId) {
      context.parentMenuContext()?.setPointerGraceIntent(null);

      openTimeoutId = window.setTimeout(() => {
        context.open(false);
        clearOpenTimeout();
      }, 100);
    }

    parentMenuContext?.onItemEnter(e);

    if (!e.defaultPrevented) {
      // Remove visual focus from sub menu content.
      if (context.listState().selectionManager().isFocused()) {
        context.listState().selectionManager().setFocused(false);
        context.listState().selectionManager().setFocusedKey(undefined);
      }

      // Restore visual focus to parent menu content.
      focusSafely(e.currentTarget);
      parentMenuContext?.listState().selectionManager().setFocused(true);
      parentMenuContext?.listState().selectionManager().setFocusedKey(key());
    }
  };

  const onPointerLeave: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    if (e.pointerType !== "mouse") {
      return;
    }

    clearOpenTimeout();

    const parentMenuContext = context.parentMenuContext();

    const contentEl = context.contentRef();

    if (contentEl) {
      parentMenuContext?.setPointerGraceIntent({
        area: getPointerGraceArea(context.currentPlacement(), e, contentEl),
        // Safe because sub menu always open "left" or "right".
        side: context.currentPlacement().split("-")[0] as Side,
      });

      window.clearTimeout(parentMenuContext?.pointerGraceTimeoutId());

      const pointerGraceTimeoutId = window.setTimeout(() => {
        parentMenuContext?.setPointerGraceIntent(null);
      }, 300);

      parentMenuContext?.setPointerGraceTimeoutId(pointerGraceTimeoutId);
    } else {
      parentMenuContext?.onTriggerLeave(e);

      if (e.defaultPrevented) {
        return;
      }

      // There's 100ms where the user may leave an item before the submenu was opened.
      parentMenuContext?.setPointerGraceIntent(null);
    }

    parentMenuContext?.onItemLeave(e);
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

    // For consistency with native, open the menu on key down.
    if (SUB_OPEN_KEYS[direction()].includes(e.key)) {
      e.stopPropagation();
      e.preventDefault();

      // Clear focus on parent menu (e.g. the menu containing the trigger).
      parentSelectionManager().setFocused(false);
      parentSelectionManager().setFocusedKey(undefined);

      // We focus manually because we prevented it in MenuSubContent's `onOpenAutoFocus`.
      if (context.isOpen()) {
        context.focusContent();
        context.listState().selectionManager().setFocused(true);
        context.listState().selectionManager().setFocusedKey(collection().getFirstKey());
      } else {
        context.open("first");
      }
    }
  };

  createEffect(() => {
    // Not able to register the trigger as a menu item on parent menu means
    // `Menu.SubTrigger` is not used in the correct place, so throw an error.
    if (context.registerItemToParentDomCollection == null) {
      throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");
    }

    // Register the item trigger on the parent menu that contains it.
    const unregister = context.registerItemToParentDomCollection({
      ref: () => ref,
      key: key(),
      label: "", // not applicable here
      textValue: local.textValue ?? ref?.textContent ?? "",
      isDisabled: local.isDisabled ?? false,
    });

    onCleanup(unregister);
  });

  createEffect(
    on(
      () => context.parentMenuContext()?.pointerGraceTimeoutId(),
      pointerGraceTimer => {
        onCleanup(() => {
          window.clearTimeout(pointerGraceTimer);
          context.parentMenuContext()?.setPointerGraceIntent(null);
        });
      }
    )
  );

  createEffect(() => onCleanup(context.registerTriggerId(local.id!)));

  onCleanup(() => {
    clearOpenTimeout();
  });

  return (
    <Dynamic
      component={local.as}
      ref={mergeRefs(el => {
        context.setTriggerRef(el);
        ref = el;
      }, local.ref)}
      id={local.id}
      role="menuitem"
      tabIndex={selectableItem.tabIndex()}
      aria-haspopup="true"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      aria-disabled={local.isDisabled}
      data-key={selectableItem.dataKey()}
      data-expanded={context.isOpen() ? "" : undefined}
      data-disabled={local.isDisabled ? "" : undefined}
      data-hover={isHovered() ? "" : undefined}
      data-focus={isFocused() ? "" : undefined}
      data-focus-visible={isFocusVisible() ? "" : undefined}
      data-active={isPressed() ? "" : undefined}
      onKeyDown={composeEventHandlers([
        local.onKeyDown,
        selectableItem.pressHandlers.onKeyDown,
        selectableItem.longPressHandlers.onKeyDown,
        pressHandlers.onKeyDown,
        onKeyDown,
      ])}
      onKeyUp={composeEventHandlers([
        local.onKeyUp,
        selectableItem.pressHandlers.onKeyUp,
        selectableItem.longPressHandlers.onKeyUp,
        pressHandlers.onKeyUp,
      ])}
      onClick={composeEventHandlers([
        local.onClick,
        selectableItem.pressHandlers.onClick,
        selectableItem.longPressHandlers.onClick,
        pressHandlers.onClick,
      ])}
      onPointerDown={composeEventHandlers([
        local.onPointerDown,
        selectableItem.pressHandlers.onPointerDown,
        selectableItem.longPressHandlers.onPointerDown,
        pressHandlers.onPointerDown,
      ])}
      onPointerUp={composeEventHandlers([
        local.onPointerUp,
        selectableItem.pressHandlers.onPointerUp,
        selectableItem.longPressHandlers.onPointerUp,
        pressHandlers.onPointerUp,
      ])}
      onMouseDown={composeEventHandlers([
        local.onMouseDown,
        selectableItem.otherHandlers.onMouseDown,
        selectableItem.pressHandlers.onMouseDown,
        selectableItem.longPressHandlers.onMouseDown,
        pressHandlers.onMouseDown,
      ])}
      onDragStart={composeEventHandlers([
        local.onDragStart,
        selectableItem.pressHandlers.onDragStart,
        selectableItem.longPressHandlers.onDragStart,
        selectableItem.otherHandlers.onDragStart,
        pressHandlers.onDragStart,
      ])}
      onPointerEnter={composeEventHandlers([local.onPointerEnter, hoverHandlers.onPointerEnter])}
      onPointerLeave={composeEventHandlers([
        local.onPointerLeave,
        onPointerLeave,
        hoverHandlers.onPointerLeave,
      ])}
      onPointerMove={onPointerMove}
      onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
      onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
      onFocus={composeEventHandlers([local.onFocus, selectableItem.otherHandlers.onFocus])}
      {...others}
    />
  );
});
