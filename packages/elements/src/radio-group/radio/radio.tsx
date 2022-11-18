/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadio.ts
 */

import { chainHandlers, createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createFocusRing } from "../../primitives";
import { useRadioGroupContext } from "../radio-group-context";
import { RadioContext, RadioContextValue } from "./radio-context";
import { RadioControl } from "./radio-control";
import { RadioInput } from "./radio-input";
import { RadioLabel } from "./radio-label";

type RadioComposite = {
  Label: typeof RadioLabel;
  Input: typeof RadioInput;
  Control: typeof RadioControl;
};

export interface RadioProps {
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;

  /** Whether the radio button is disabled or not. */
  disabled?: boolean;
}

/**
 * The root container for a radio button.
 */
export const Radio = createPolymorphicComponent<"label", RadioProps, RadioComposite>(props => {
  const radioGroupContext = useRadioGroupContext();

  props = mergeDefaultProps({ as: "label" }, props);

  const [local, others] = splitProps(props, ["as", "children", "value", "disabled"]);

  const isSelected = createMemo(() => {
    return radioGroupContext.selectedValue() === local.value;
  });

  const isDisabled = createMemo(() => {
    return local.disabled || radioGroupContext.disabled() || false;
  });

  const context: RadioContextValue = {
    value: () => local.value,
    isSelected,
    isDisabled,
  };

  return (
    <Dynamic
      component={local.as}
      data-part="root"
      data-checked={isSelected() ? "" : undefined}
      data-disabled={isDisabled() ? "" : undefined}
      {...others}
    >
      <RadioContext.Provider value={context}>{local.children}</RadioContext.Provider>
    </Dynamic>
  );
});

Radio.Label = RadioLabel;
Radio.Input = RadioInput;
Radio.Control = RadioControl;
