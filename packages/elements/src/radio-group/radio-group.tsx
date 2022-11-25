/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";

import {
  FormControl,
  FormControlComposite,
  FormControlDescription,
  FormControlErrorMessage,
  FormControlLabel,
  FormControlProps,
} from "../form-control";
import { createControllableSignal, createFormResetListener } from "../primitives";
import { RadioGroupContext, RadioGroupContextValue } from "./radio-group-context";

export interface RadioGroupProps extends Omit<FormControlProps, "isField"> {
  /** The controlled value of the radio button to check. */
  value?: string;

  /**
   * The value of the radio button that should be checked when initially rendered.
   * Useful when you do not need to control the state of the radio buttons.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string | undefined) => void;

  /** The axis the radio group items should align with. */
  orientation?: "horizontal" | "vertical";
}

/**
 * A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
 * This component is based on the [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/)
 */
export const RadioGroup = createPolymorphicComponent<"div", RadioGroupProps, FormControlComposite>(
  props => {
    let ref: HTMLDivElement | undefined;

    const defaultId = `kb-radiogroup-${createUniqueId()}`;

    props = mergeDefaultProps(
      {
        id: defaultId,
        orientation: "vertical",
      },
      props
    );

    const [local, others] = splitProps(props, [
      "ref",
      "children",
      "value",
      "defaultValue",
      "onValueChange",
      "orientation",
    ]);

    const [selected, setSelected] = createControllableSignal<string | undefined>({
      value: () => local.value,
      defaultValue: () => local.defaultValue,
      onChange: value => local.onValueChange?.(value),
    });

    createFormResetListener(
      () => ref,
      () => setSelected(local.defaultValue)
    );

    const context: RadioGroupContextValue = {
      isSelectedValue: (value: string) => value === selected(),
      setSelectedValue: value => {
        if (!others.isReadOnly && !others.isDisabled) {
          setSelected(value);
        }
      },
    };

    return (
      <FormControl
        isField
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="radiogroup"
        aria-invalid={others.validationState === "invalid" || undefined}
        aria-required={others.isRequired || undefined}
        aria-disabled={others.isDisabled || undefined}
        aria-readonly={others.isReadOnly || undefined}
        aria-orientation={local.orientation}
        {...others}
      >
        <RadioGroupContext.Provider value={context}>{local.children}</RadioGroupContext.Provider>
      </FormControl>
    );
  }
);

RadioGroup.Label = FormControlLabel;
RadioGroup.Description = FormControlDescription;
RadioGroup.ErrorMessage = FormControlErrorMessage;
