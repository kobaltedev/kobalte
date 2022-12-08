import {
  callHandler,
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { PressEvent } from "../primitives";
import { useSelectContext } from "./select-context";
import { createTypeSelect } from "../selection";

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
    "ref",
    "id",
    "isDisabled",
    "onPressStart",
    "onPress",
    "onKeyDown",
  ]);

  const selectionManager = () => context.listState().selectionManager();
  const keyboardDelegate = () => context.keyboardDelegate();

  const isDisabled = () => local.isDisabled || context.isDisabled();

  const { typeSelectHandlers } = createTypeSelect({
    keyboardDelegate: keyboardDelegate,
    selectionManager: selectionManager,
    onTypeSelect: key => selectionManager().select(key),
  });

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

    if (isDisabled()) {
      return;
    }

    callHandler(e, typeSelectHandlers.onKeyDown);

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
      case "ArrowLeft": {
        // prevent scrolling containers
        e.preventDefault();

        if (!context.isSingleSelectMode()) {
          return;
        }

        const firstSelectedKey = selectionManager().firstSelectedKey();

        const key =
          firstSelectedKey != null
            ? keyboardDelegate().getKeyAbove?.(firstSelectedKey)
            : keyboardDelegate().getFirstKey?.();

        if (key) {
          selectionManager().select(key);
        }

        break;
      }
      case "ArrowRight": {
        // prevent scrolling containers
        e.preventDefault();

        if (!context.isSingleSelectMode()) {
          return;
        }

        const firstSelectedKey = selectionManager().firstSelectedKey();

        const key =
          firstSelectedKey != null
            ? keyboardDelegate().getKeyBelow?.(firstSelectedKey)
            : keyboardDelegate().getFirstKey?.();

        if (key) {
          selectionManager().select(key);
        }

        break;
      }
    }
  };

  createEffect(() => onCleanup(context.registerTrigger(local.id!)));

  return (
    <Button
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      id={local.id}
      aria-haspopup="listbox"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.listboxId() : undefined}
      //aria-labelledby={}
      isDisabled={isDisabled()}
      onPressStart={onPressStart}
      onPress={onPress}
      onKeyDown={onKeyDown}
      {...others}
    />
  );
});
