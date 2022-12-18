/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import { callHandler, combineProps, mergeDefaultProps, visuallyHiddenStyles } from "@kobalte/utils";
import { ComponentProps, JSX, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { createFocusRing, createPress } from "../primitives";
import { useRadioGroupContext } from "./radio-group-context";
import { useRadioGroupItemContext } from "./radio-group-item-context";

/**
 * The native html input that is visually hidden in the radio button.
 */
export function RadioGroupItemInput(props: ComponentProps<"input">) {
  const formControlContext = useFormControlContext();
  const radioGroupContext = useRadioGroupContext();
  const radioContext = useRadioGroupItemContext();

  props = mergeDefaultProps(
    {
      id: radioContext.generateId("input"),
    },
    props
  );

  const [local, others] = splitProps(props, ["onChange"]);

  const { pressHandlers } = createPress({
    isDisabled: radioContext.isDisabled,
  });

  const { focusRingHandlers } = createFocusRing({
    onFocusChange: value => radioContext.setIsFocused(value),
    onFocusVisibleChange: value => radioContext.setIsFocusVisible(value),
  });

  const ariaLabelledBy = () => {
    return (
      [
        radioContext.ariaLabelledBy(),
        // If there is both an aria-label and aria-labelledby, add the input itself has an aria-labelledby
        radioContext.ariaLabelledBy() != null && radioContext.ariaLabel() != null
          ? others.id
          : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const ariaDescribedBy = () => {
    return (
      [radioContext.ariaDescribedBy(), radioGroupContext.ariaDescribedBy()]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = e => {
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

  return (
    <input
      type="radio"
      name={formControlContext.name()}
      value={radioContext.value()}
      checked={radioContext.isSelected()}
      required={formControlContext.isRequired()}
      disabled={radioContext.isDisabled()}
      readonly={formControlContext.isReadOnly()}
      aria-label={radioContext.ariaLabel()}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={ariaDescribedBy()}
      onChange={onChange}
      {...radioContext.dataset()}
      {...combineProps({ style: visuallyHiddenStyles }, others, pressHandlers, focusRingHandlers)}
    />
  );
}
