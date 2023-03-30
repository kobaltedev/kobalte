/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import {
  callHandler,
  mergeDefaultProps,
  OverrideComponentProps,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { useRadioGroupContext } from "./radio-group-context";
import { useRadioGroupItemContext } from "./radio-group-item-context";

export interface RadioGroupItemInputOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface RadioGroupItemInputProps
  extends OverrideComponentProps<"input", RadioGroupItemInputOptions> {}

/**
 * The native html input that is visually hidden in the radio button.
 */
export function RadioGroupItemInput(props: RadioGroupItemInputProps) {
  const formControlContext = useFormControlContext();
  const radioGroupContext = useRadioGroupContext();
  const radioContext = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      id: radioContext.generateId("input"),
    },
    props
  );

  const [local, others] = splitProps(props, [
    "style",
    "aria-labelledby",
    "aria-describedby",
    "onChange",
    "onFocus",
    "onBlur",
  ]);

  const ariaLabelledBy = () => {
    return (
      [
        local["aria-labelledby"],
        // If there is both an aria-label and aria-labelledby, add the input itself has an aria-labelledby
        local["aria-labelledby"] != null && others["aria-label"] != null ? others.id : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const ariaDescribedBy = () => {
    return (
      [local["aria-describedby"], radioGroupContext.ariaDescribedBy()].filter(Boolean).join(" ") ||
      undefined
    );
  };

  const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = e => {
    callHandler(e, local.onChange);

    e.stopPropagation();

    radioGroupContext.setSelectedValue(radioContext.value());

    const target = e.target as HTMLInputElement;

    // Unlike in React, inputs `checked` state can be out of sync with our state.
    // for example a readonly `<input type="radio" />` is always "checkable".
    //
    // Also, even if an input is controlled (ex: `<input type="radio" checked={isChecked} />`,
    // clicking on the input will change its internal `checked` state.
    //
    // To prevent this, we need to force the input `checked` state to be in sync with our state.
    target.checked = radioContext.isSelected();
  };

  const onFocus: JSX.FocusEventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocus);
    radioContext.setIsFocused(true);
  };

  const onBlur: JSX.FocusEventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onBlur);
    radioContext.setIsFocused(false);
  };

  return (
    <input
      type="radio"
      name={formControlContext.name()}
      value={radioContext.value()}
      checked={radioContext.isSelected()}
      required={formControlContext.isRequired()}
      disabled={radioContext.isDisabled()}
      readonly={formControlContext.isReadOnly()}
      style={{ ...visuallyHiddenStyles, ...local.style }}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={ariaDescribedBy()}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      {...radioContext.dataset()}
      {...others}
    />
  );
}
