import { callHandler, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { PressEvent } from "../primitives";
import { useSelectContext } from "./select-context";

export interface SelectTriggerProps extends ButtonProps {}

export const SelectTrigger = createPolymorphicComponent<"button", SelectTriggerProps>(props => {
  const context = useSelectContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("trigger"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "id",
    "isDisabled",
    "onPressStart",
    "onPress",
    "onKeyDown",
    "onFocus",
    "onBlur",
  ]);

  const isDisabled = () => local.isDisabled || context.isDisabled();

  const onPressStart = (e: PressEvent) => {
    local.onPressStart?.(e);

    // For consistency with native, open the menu on mouse/key down, but touch up.
    if (e.pointerType !== "touch" && e.pointerType !== "keyboard" && !isDisabled()) {
      // If opened with a screen reader, autofocus the first item.
      // Otherwise, the menu itself will be focused.
      context.toggle(e.pointerType === "virtual" ? "first" : undefined);
    }
  };
  const onPress = (e: PressEvent) => {
    local.onPress?.(e);

    if (e.pointerType === "touch" && !isDisabled()) {
      context.toggle();
    }
  };

  const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);
    callHandler(e, context.onTriggerKeyDown);
  };

  const onFocus: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);
    callHandler(e, context.onTriggerFocus);
  };

  const onBlur: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onBlur);
    callHandler(e, context.onTriggerBlur);
  };

  createEffect(() => onCleanup(context.registerTrigger(local.id!)));

  return (
    <Button
      id={local.id}
      aria-haspopup="listbox"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.listboxId() : undefined}
      //aria-labelledby={}
      isDisabled={isDisabled()}
      onPressStart={onPressStart}
      onPress={onPress}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      {...others}
    />
  );
});
