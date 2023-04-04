import {
  callHandler,
  contains,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
} from "@kobalte/utils";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";

import {
  createFormControlField,
  FORM_CONTROL_FIELD_PROP_NAMES,
  useFormControlContext,
} from "../form-control";
import { Polymorphic } from "../polymorphic";
import { useComboboxContext } from "./combobox-context";

export interface ComboboxInputOptions {}

export interface ComboboxInputProps extends OverrideComponentProps<"input", ComboboxInputOptions> {}

export function ComboboxInput(props: ComboboxInputProps) {
  let ref: HTMLInputElement | undefined;

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
    ["ref", "disabled", "onInput", "onPointerDown", "onClick", "onKeyDown", "onFocus", "onBlur"],
    FORM_CONTROL_FIELD_PROP_NAMES
  );

  const selectionManager = () => context.listState().selectionManager();

  const isDisabled = () => local.disabled || context.isDisabled();

  const { fieldProps } = createFormControlField(formControlFieldProps);

  const onInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = e => {
    callHandler(e, local.onInput);

    if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
      return;
    }

    // Clear focused key when input value changes.
    selectionManager().setFocusedKey(undefined);

    const target = e.target as HTMLInputElement;

    context.setInputValue(target.value);

    // Unlike in React, inputs `value` can be out of sync with our value state.
    // even if an input is controlled (ex: `<input value="foo" />`,
    // typing on the input will change its internal `value`.
    //
    // To prevent this, we need to force the input `value` to be in sync with the textfield value state.
    target.value = context.inputValue() ?? "";
  };

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
        // Prevent form submission if menu is open since we may be selecting an option.
        if (context.isOpen()) {
          e.preventDefault();

          const focusedKey = selectionManager().focusedKey();

          if (focusedKey != null) {
            selectionManager().select(focusedKey);
            context.setInputValue("");
          }
        }

        break;
      case "Tab":
        context.isOpen() && context.close();
        break;
      case "Escape":
        context.isOpen() && context.close();
        break;
      case "ArrowDown":
        !context.isOpen() && context.open("first", "manual");
        break;
      case "ArrowUp":
        !context.isOpen() && context.open("last", "manual");
        break;
      case "ArrowLeft":
      case "ArrowRight":
        selectionManager().setFocusedKey(undefined);
        break;
      case "Backspace":
        if (context.inputValue() === "") {
          selectionManager().toggleSelection(selectionManager().lastSelectedKey() ?? "");
        }
        break;
    }
  };

  const onFocus: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);

    context.setIsInputFocused(true);
  };

  const onBlur: JSX.FocusEventHandlerUnion<HTMLInputElement, FocusEvent> = e => {
    callHandler(e, local.onBlur);

    // Ignore blur if focused moved to the button or into the menu.
    if (
      e.relatedTarget === context.buttonRef() ||
      contains(context.contentRef(), e.relatedTarget as any)
    ) {
      return;
    }

    context.setIsInputFocused(false);
  };

  // If a touch happens on direct center of Combobox input, might be virtual click from iPad so open ComboBox menu
  let lastEventTime = 0;

  const onTouchEnd: JSX.EventHandlerUnion<HTMLInputElement, TouchEvent> = e => {
    if (!ref || isDisabled()) {
      return;
    }

    // Sometimes VoiceOver on iOS fires two touchend events in quick succession. Ignore the second one.
    if (e.timeStamp - lastEventTime < 500) {
      e.preventDefault();
      ref.focus();
      return;
    }

    const rect = (e.target as Element).getBoundingClientRect();
    const touch = e.changedTouches[0];

    const centerX = Math.ceil(rect.left + 0.5 * rect.width);
    const centerY = Math.ceil(rect.top + 0.5 * rect.height);

    if (touch.clientX === centerX && touch.clientY === centerY) {
      e.preventDefault();
      ref.focus();
      context.toggle(false, "manual");

      lastEventTime = e.timeStamp;
    }
  };

  createEffect(() => onCleanup(context.registerInputId(fieldProps.id()!)));

  return (
    <Polymorphic
      as="input"
      ref={mergeRefs(el => {
        context.setInputRef(el);
        ref = el;
      }, local.ref)}
      value={context.inputValue()}
      id={fieldProps.id()}
      disabled={isDisabled()}
      role="combobox"
      autoComplete="off"
      // Disable iOS's autocorrect suggestions, since the combo box provides its own suggestions.
      autoCorrect="off"
      // Disable the macOS Safari spell check auto corrections.
      spellCheck="false"
      aria-haspopup="listbox"
      aria-autocomplete="list"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.listboxId() : undefined}
      aria-activedescendant={context.activeDescendant()}
      aria-label={fieldProps.ariaLabel()}
      aria-describedby={fieldProps.ariaDescribedBy()}
      onInput={onInput}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onTouchEnd={onTouchEnd}
      {...context.dataset()}
      {...formControlContext.dataset()}
      {...others}
    />
  );
}
