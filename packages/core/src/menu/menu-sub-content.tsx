import {
  callHandler,
  composeEventHandlers,
  contains,
  createPolymorphicComponent,
  focusWithoutScrolling,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { createHover, FocusOutsideEvent } from "../primitives";
import { MenuContentBase, MenuContentBaseOptions } from "./menu-content-base";
import { useMenuContext } from "./menu-context";

export interface MenuSubContentOptions
  extends Omit<MenuContentBaseOptions, "onOpenAutoFocus" | "onCloseAutoFocus"> {}

export const MenuSubContent = createPolymorphicComponent<"div", MenuSubContentOptions>(props => {
  const context = useMenuContext();

  const [local, others] = splitProps(props, [
    "onFocusOutside",
    "onPointerEnter",
    "onPointerLeave",
    "onKeyDown",
  ]);

  const { hoverHandlers } = createHover({
    isDisabled: () => !context.isOpen(),
    onHoverStart: () => {},
    onHoverEnd: () => {},
  });

  const onOpenAutoFocus = (e: Event) => {
    // when opening a submenu, focus content for keyboard users only (handled by `MenuSubTrigger`).
    e.preventDefault();
  };

  const onCloseAutoFocus = (e: Event) => {
    // The menu might close because of focusing another menu item in the parent menu.
    // We don't want it to refocus the trigger in that case, so we handle trigger focus ourselves.
    e.preventDefault();
  };

  const onFocusOutside = (e: FocusOutsideEvent) => {
    local.onFocusOutside?.(e);

    const target = e.target as HTMLElement | null;

    // We prevent closing when the trigger is focused to avoid triggering a re-open animation
    // on pointer interaction.
    if (!contains(context.triggerRef(), target)) {
      context.close();
    }
  };

  const onKeyDown: JSX.EventHandlerUnion<any, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    // Submenu key events bubble through portals. We only care about keys in this menu.
    const isKeyDownInside = contains(e.currentTarget, e.target as HTMLElement);
    const isCloseKey = e.key === "ArrowLeft" && context.parentMenuContext() != null;

    if (isKeyDownInside && isCloseKey) {
      context.close();

      // We focus manually because we prevented it in `onCloseAutoFocus`.
      focusWithoutScrolling(context.triggerRef());
    }
  };

  return (
    <MenuContentBase
      onOpenAutoFocus={onOpenAutoFocus}
      onCloseAutoFocus={onCloseAutoFocus}
      onFocusOutside={onFocusOutside}
      onKeyDown={onKeyDown}
      onPointerEnter={composeEventHandlers([local.onPointerEnter, hoverHandlers.onPointerEnter])}
      onPointerLeave={composeEventHandlers([local.onPointerLeave, hoverHandlers.onPointerLeave])}
      {...others}
    />
  );
});
