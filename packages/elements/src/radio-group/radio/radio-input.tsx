/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import {
  callHandler,
  combineProps,
  createPolymorphicComponent,
  mergeDefaultProps,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createPress } from "../../primitives";
import { useRadioGroupContext } from "../radio-group-context";
import { useRadioContext } from "./radio-context";

export interface RadioInputProps {
  /** The HTML style attribute (only object form supported). */
  style?: JSX.CSSProperties;
}

/**
 * The native html input that is visually hidden in a radio button.
 */
export const RadioInput = createPolymorphicComponent<"input", RadioInputProps>(props => {
  const radioGroupContext = useRadioGroupContext();
  const radioContext = useRadioContext();

  props = mergeDefaultProps({ as: "input" }, props);

  const [local, others] = splitProps(props, ["as", "style", "onChange"]);

  const { pressProps } = createPress({
    get disabled() {
      return radioContext.isDisabled();
    },
  });

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
    <Dynamic
      component={local.as}
      type="radio"
      name={radioGroupContext.name()}
      value={radioContext.value()}
      checked={radioContext.isSelected()}
      disabled={radioContext.isDisabled()}
      style={{ ...visuallyHiddenStyles, ...local.style }}
      aria-describedby={radioGroupContext.allAriaDescribedBy()}
      data-part="input"
      data-checked={radioContext.isSelected() ? "" : undefined}
      data-disabled={radioContext.isDisabled() ? "" : undefined}
      onChange={onChange}
      {...combineProps(others, pressProps)}
    />
  );
});
