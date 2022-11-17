/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */

import {
  createPolymorphicComponent,
  mergeDefaultProps,
  mergeRefs,
  ValidationState,
} from "@kobalte/utils";
import { createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createControllableSignal, createFormResetListener } from "../primitives";
import { RadioGroupContext, RadioGroupContextValue } from "./radio-group-context";
import { RadioGroupDescription } from "./radio-group-description";
import { RadioGroupErrorMessage } from "./radio-group-error-message";
import { RadioGroupLabel } from "./radio-group-label";

type RadioGroupComposite = {
  Label: typeof RadioGroupLabel;
  Description: typeof RadioGroupDescription;
  ErrorMessage: typeof RadioGroupErrorMessage;
};

export interface RadioGroupProps {
  /** The controlled value of the radio item to check. */
  value?: string;

  /**
   * The value of the radio item that should be checked when initially rendered.
   * Useful when you do not need to control the state of the radio items.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string | undefined) => void;

  /**
   * The name of the radio group.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;

  /** Whether the radio group should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must check a radio group item before the owning form can be submitted. */
  required?: boolean;

  /** Whether the radio group is disabled. */
  disabled?: boolean;

  /** Whether the radio group items can be selected but not changed by the user. */
  readOnly?: boolean;

  /** The axis the radio group items should align with. */
  orientation?: "horizontal" | "vertical";
}

/**
 * A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.
 * This component is based on the [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/)
 */
export const RadioGroup = createPolymorphicComponent<"div", RadioGroupProps, RadioGroupComposite>(
  props => {
    let ref: HTMLDivElement | undefined;

    const defaultId = `kb-radiogroup-${createUniqueId()}`;

    props = mergeDefaultProps(
      {
        as: "div",
        id: defaultId,
        name: defaultId,
        orientation: "vertical",
      },
      props
    );

    const [local, others] = splitProps(props, [
      "as",
      "ref",
      "children",
      "value",
      "defaultValue",
      "onValueChange",
      "id",
      "name",
      "validationState",
      "required",
      "disabled",
      "readOnly",
      "orientation",
      "aria-labelledby",
      "aria-describedby",
    ]);

    const [selectedValue, setSelectedValue] = createControllableSignal<string | undefined>({
      value: () => local.value,
      defaultValue: () => local.defaultValue,
      onChange: value => local.onValueChange?.(value),
    });

    const [ariaLabelledBy, setAriaLabelledBy] = createSignal<string>();
    const [ariaDescribedBy, setAriaDescribedBy] = createSignal<string>();
    const [ariaErrorMessage, setAriaErrorMessage] = createSignal<string>();

    const allAriaLabelledBy = createMemo(() => {
      return [local["aria-labelledby"], ariaLabelledBy()].filter(Boolean).join(" ") || undefined;
    });

    const allAriaDescribedBy = createMemo(() => {
      // aria-errormessage is not fully supported, so we put it as the first aria-describedby id instead
      // @See https://www.davidmacd.com/blog/test-aria-describedby-errormessage-aria-live.ht
      // and https://a11ysupport.io/tech/aria/aria-errormessage_attribute
      return (
        [ariaErrorMessage(), local["aria-describedby"], ariaDescribedBy()]
          .filter(Boolean)
          .join(" ") || undefined
      );
    });

    createFormResetListener(
      () => ref,
      () => setSelectedValue(undefined)
    );

    const context: RadioGroupContextValue = {
      selectedValue,
      setSelectedValue,
      name: () => local.name!,
      validationState: () => local.validationState,
      required: () => local.required,
      disabled: () => local.disabled,
      readOnly: () => local.readOnly,
      getPartId: part => `${local.id!}-${part}`,
      allAriaDescribedBy,
      setAriaLabelledBy,
      setAriaDescribedBy,
      setAriaErrorMessage,
    };

    return (
      <Dynamic
        component={local.as}
        ref={mergeRefs(el => (ref = el), local.ref)}
        role="radiogroup"
        id={local.id}
        aria-labelledby={allAriaLabelledBy()}
        aria-describedby={allAriaDescribedBy()}
        aria-invalid={local.validationState === "invalid" || undefined}
        aria-required={local.required || undefined}
        aria-disabled={local.disabled || undefined}
        aria-readonly={local.readOnly || undefined}
        aria-orientation={local.orientation}
        data-part="root"
        data-valid={local.validationState === "valid" ? "" : undefined}
        data-invalid={local.validationState === "invalid" ? "" : undefined}
        data-required={local.required ? "" : undefined}
        data-disabled={local.disabled ? "" : undefined}
        data-readonly={local.readOnly ? "" : undefined}
        {...others}
      >
        <RadioGroupContext.Provider value={context}>{local.children}</RadioGroupContext.Provider>
      </Dynamic>
    );
  }
);

RadioGroup.Label = RadioGroupLabel;
RadioGroup.Description = RadioGroupDescription;
RadioGroup.ErrorMessage = RadioGroupErrorMessage;
