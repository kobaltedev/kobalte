/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/menu/src/useMenuTrigger.ts
 */

import { callHandler, mergeDefaultProps, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import * as Button from "../button";
import { useMenuContext } from "./menu-context";
import { useMenuRootContext } from "./menu-root-context";

export interface MenuTriggerOptions extends Button.ButtonRootOptions {}

export interface MenuTriggerProps extends OverrideComponentProps<"button", MenuTriggerOptions> {}

/**
 * The button that toggles the menu.
 */
export function MenuTrigger(props: MenuTriggerProps) {
  const rootContext = useMenuRootContext();
  const context = useMenuContext();

  props = mergeDefaultProps(
    {
      id: rootContext.generateId("trigger"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "id",
    "disabled",
    "onPointerDown",
    "onClick",
    "onKeyDown",
  ]);

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    e.currentTarget.dataset.pointerType = e.pointerType;

    // For consistency with native, open the select on mouse down (main button), but touch up.
    if (!local.disabled && e.pointerType !== "touch" && e.button === 0) {
      context.toggle(true);
    }
  };

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);

    if (!local.disabled && e.currentTarget.dataset.pointerType === "touch") {
      context.toggle(true);
    }
  };

  const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    if (local.disabled) {
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
    <Button.Root
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      id={local.id}
      disabled={local.disabled}
      aria-haspopup="true"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...context.dataset()}
      {...others}
    />
  );
}
