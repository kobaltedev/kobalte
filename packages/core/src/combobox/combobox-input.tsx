import {
  callHandler,
  contains,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import * as Button from "../button";
import {
  createFormControlField,
  FORM_CONTROL_FIELD_PROP_NAMES,
  useFormControlContext,
} from "../form-control";

import { useComboboxContext } from "./combobox-context";
import { Polymorphic } from "../polymorphic";

export interface ComboboxInputOptions {}

export interface ComboboxInputProps extends OverrideComponentProps<"input", ComboboxInputOptions> {}

export function ComboboxInput(props: ComboboxInputProps) {
  const formControlContext = useFormControlContext();
  const context = useComboboxContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );

  const [local, formControlFieldProps, others] = splitProps(
    props,
    ["ref", "disabled", "onPointerDown", "onClick", "onKeyDown", "onFocus", "onBlur"],
    FORM_CONTROL_FIELD_PROP_NAMES
  );

  const selectionManager = () => context.listState().selectionManager();
  const keyboardDelegate = () => context.keyboardDelegate();

  const isDisabled = () => local.disabled || context.isDisabled();

  const { fieldProps } = createFormControlField(formControlFieldProps);

  const onKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = e => {
    callHandler(e, local.onKeyDown);

    if (isDisabled()) {
      return;
    }

    if (context.isOpen()) {
      callHandler(e, context.onInputKeyDown);
    }

    switch (e.key) {
      case "Enter":
      case "Tab":
        // Prevent form submission if menu is open since we may be selecting a option
        if (context.isOpen() && e.key === "Enter") {
          e.preventDefault();
        }

        //context.commit();
        break;
      case "Escape":
        //context.revert();
        break;
      case "ArrowDown":
        if (!context.isOpen()) {
          context.open("first", "manual");
        }
        break;
      case "ArrowUp":
        if (!context.isOpen()) {
          context.open("last", "manual");
        }
        break;
      case "ArrowLeft":
      case "ArrowRight":
        selectionManager().setFocusedKey(undefined);
        break;
    }
  };

  const onFocus: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);

    if (selectionManager().isFocused()) {
      return;
    }

    context.setIsFocused(true);
    selectionManager().setFocused(true);
  };

  const onBlur: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = e => {
    callHandler(e, local.onBlur);

    // Ignore blur if focused moved to the button or into the popover.
    if (
      e.relatedTarget === context.buttonRef() ||
      contains(context.contentRef(), e.relatedTarget as any)
    ) {
      return;
    }

    context.setIsFocused(false);
    selectionManager().setFocused(false);
  };

  createEffect(() => onCleanup(context.registerInputId(fieldProps.id()!)));

  createEffect(() => {
    context.setListboxAriaLabelledBy(
      [
        fieldProps.ariaLabelledBy(),
        fieldProps.ariaLabel() && !fieldProps.ariaLabelledBy() ? fieldProps.id() : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  });

  return (
    <Polymorphic
      as="input"
      ref={mergeRefs(context.setInputRef, local.ref)}
      id={fieldProps.id()}
      disabled={isDisabled()}
      role="combobox"
      autoComplete="off"
      // Disable iOS's autocorrect suggestions, since the combo box provides its own suggestions.
      autoCorrect="off"
      // Disable the macOS Safari spell check auto corrections.
      spellCheck="false"
      aria-haspopup="listbox"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.listboxId() : undefined}
      aria-autocomplete="list"
      aria-activedescendant={""}
      aria-label={fieldProps.ariaLabel()}
      aria-labelledby={context.listboxAriaLabelledBy()}
      aria-describedby={fieldProps.ariaDescribedBy()}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      {...context.dataset()}
      {...formControlContext.dataset()}
      {...others}
    />
  );
}
