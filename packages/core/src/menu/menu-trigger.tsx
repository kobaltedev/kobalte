/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuTrigger.ts
 */

import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { PressEvent } from "../primitives";
import { useMenuContext } from "./menu-context";

export interface MenuTriggerProps extends ButtonProps {}

export const MenuTrigger = createPolymorphicComponent<"button", MenuTriggerProps>(props => {
  const context = useMenuContext();

  props = mergeDefaultProps({ id: context.generateId("trigger") }, props);

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "isDisabled",
    "onPressStart",
    "onPress",
    "onKeyDown",
  ]);

  const onPressStart = (e: PressEvent) => {
    local.onPressStart?.(e);

    // For consistency with native, open the menu on mouse down, but touch up.
    if (e.pointerType !== "touch" && e.pointerType !== "keyboard" && !local.isDisabled) {
      // If opened with a screen reader, autofocus the first item.
      // Otherwise, the menu itself will be focused.
      context.toggle(e.pointerType === "virtual" ? "first" : undefined);
    }
  };

  const onPress = (e: PressEvent) => {
    local.onPress?.(e);

    if (e.pointerType === "touch" && !local.isDisabled) {
      context.toggle();
    }
  };

  const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    if (local.isDisabled) {
      return;
    }

    // For consistency with native, open the menu on key down.
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.stopPropagation();
        e.preventDefault();
        context.toggle("first");
        break;
      case "ArrowUp":
        e.stopPropagation();
        e.preventDefault();
        context.toggle("last");
        break;
    }
  };

  createEffect(() => onCleanup(context.registerTriggerId(local.id!)));

  return (
    <Button
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      id={local.id}
      isDisabled={local.isDisabled}
      aria-haspopup="true"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      data-expanded={context.isOpen() ? "" : undefined}
      onPressStart={onPressStart}
      onPress={onPress}
      onKeyDown={onKeyDown}
      {...others}
    />
  );
});
