/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/5c1920e50d4b2b80c826ca91aff55c97350bf9f9/packages/@react-aria/select/src/useSelect.ts
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
import {
  createFormControlField,
  FORM_CONTROL_FIELD_PROP_NAMES,
  useFormControlContext,
} from "../form-control";
import { PressEvent } from "../primitives";
import { createTypeSelect } from "../selection";
import { useSelectContext } from "./select-context";

export const SelectTrigger = createPolymorphicComponent<"button", ButtonProps>(props => {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();

  props = mergeDefaultProps({ id: context.generateId("trigger") }, props);

  const [local, formControlFieldProps, others] = splitProps(
    props,
    ["ref", "isDisabled", "onPressStart", "onPress", "onKeyDown", "onFocus", "onBlur"],
    FORM_CONTROL_FIELD_PROP_NAMES
  );

  const selectionManager = () => context.listState().selectionManager();
  const keyboardDelegate = () => context.keyboardDelegate();

  const isDisabled = () => local.isDisabled || context.isDisabled();

  const { fieldProps } = createFormControlField(formControlFieldProps);

  const { typeSelectHandlers } = createTypeSelect({
    keyboardDelegate: keyboardDelegate,
    selectionManager: selectionManager,
    onTypeSelect: key => selectionManager().select(key),
  });

  const ariaLabelledBy = () => {
    return [context.menuAriaLabelledBy(), context.valueId()].filter(Boolean).join(" ") || undefined;
  };

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

        if (key != null) {
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

        if (key != null) {
          selectionManager().select(key);
        }

        break;
      }
    }
  };

  const onFocus: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    if (context.isFocused()) {
      return;
    }

    callHandler(e, local.onFocus);

    context.setIsFocused(true);
  };

  const onBlur: JSX.EventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    if (context.isOpen()) {
      return;
    }

    callHandler(e, local.onBlur);

    context.setIsFocused(false);
  };

  createEffect(() => onCleanup(context.registerTrigger(fieldProps.id()!)));

  createEffect(() => {
    context.setMenuAriaLabelledBy(
      [
        fieldProps.ariaLabelledBy(),
        fieldProps.ariaLabel() && !fieldProps.ariaLabelledBy() ? fieldProps.id() : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  });

  return (
    <Button
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      id={fieldProps.id()}
      isDisabled={isDisabled()}
      aria-haspopup="listbox"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.listboxId() : undefined}
      aria-label={fieldProps.ariaLabel()}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={fieldProps.ariaDescribedBy()}
      data-expanded={context.isOpen() ? "" : undefined}
      onPressStart={onPressStart}
      onPress={onPress}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      {...formControlContext.dataset()}
      {...others}
    />
  );
});
