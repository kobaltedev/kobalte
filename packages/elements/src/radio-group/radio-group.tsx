/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */

import { access, createPolymorphicComponent, mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  createFormControl,
  CreateFormControlProps,
  FORM_CONTROL_PROP_NAMES,
  FormControlContext,
  FormControlDescription,
  FormControlErrorMessage,
} from "../form-control";
import { createControllableSignal, createFormResetListener } from "../primitives";
import { RadioGroupContext, RadioGroupContextValue } from "./radio-group-context";
import { RadioGroupLabel } from "./radio-group-label";

type RadioGroupComposite = {
  Label: typeof RadioGroupLabel;
  Description: typeof FormControlDescription;
  ErrorMessage: typeof FormControlErrorMessage;
};

export interface RadioGroupProps extends CreateFormControlProps {
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
export const RadioGroup = createPolymorphicComponent<"div", RadioGroupProps, RadioGroupComposite>(
  props => {
    let ref: HTMLDivElement | undefined;

    const defaultId = `radiogroup-${createUniqueId()}`;

    props = mergeDefaultProps(
      {
        as: "div",
        id: defaultId,
        orientation: "vertical",
      },
      props
    );

    const [local, formControlProps, others] = splitProps(
      props,
      [
        "as",
        "ref",
        "value",
        "defaultValue",
        "onValueChange",
        "orientation",
        "aria-labelledby",
        "aria-describedby",
      ],
      FORM_CONTROL_PROP_NAMES
    );

    const [selected, setSelected] = createControllableSignal<string | undefined>({
      value: () => local.value,
      defaultValue: () => local.defaultValue,
      onChange: value => local.onValueChange?.(value),
    });

    const { formControlContext } = createFormControl(formControlProps);

    createFormResetListener(
      () => ref,
      () => setSelected(local.defaultValue)
    );

    const ariaLabelledBy = () => {
      return formControlContext.getAriaLabelledBy(
        access(formControlProps.id),
        others["aria-label"],
        local["aria-labelledby"]
      );
    };

    const ariaDescribedBy = () => {
      return formControlContext.getAriaDescribedBy(local["aria-describedby"]);
    };

    const context: RadioGroupContextValue = {
      ariaDescribedBy,
      isSelectedValue: (value: string) => value === selected(),
      setSelectedValue: value => {
        if (!formControlContext.isReadOnly() && !formControlContext.isDisabled()) {
          setSelected(value);
        }
      },
    };

    return (
      <FormControlContext.Provider value={formControlContext}>
        <RadioGroupContext.Provider value={context}>
          <Dynamic
            component={local.as}
            ref={mergeRefs(el => (ref = el), local.ref)}
            id={access(formControlProps.id)}
            role="radiogroup"
            aria-invalid={formControlContext.validationState() === "invalid" || undefined}
            aria-required={formControlContext.isRequired() || undefined}
            aria-disabled={formControlContext.isDisabled() || undefined}
            aria-readonly={formControlContext.isReadOnly() || undefined}
            aria-orientation={local.orientation}
            aria-labelledby={ariaLabelledBy()}
            aria-describedby={ariaDescribedBy()}
            {...formControlContext.dataset()}
            {...others}
          />
        </RadioGroupContext.Provider>
      </FormControlContext.Provider>
    );
  }
);

RadioGroup.Label = RadioGroupLabel;
RadioGroup.Description = FormControlDescription;
RadioGroup.ErrorMessage = FormControlErrorMessage;
