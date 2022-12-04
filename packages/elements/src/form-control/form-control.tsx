/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useField.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useFieldState.ts
 */

import { createPolymorphicComponent, mergeDefaultProps, ValidationState } from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
  FormControlContext,
  FormControlContextValue,
  FormControlDataSet,
} from "./form-control-context";
import { FormControlDescription } from "./form-control-description";
import { FormControlErrorMessage } from "./form-control-error-message";
import { FormControlField } from "./form-control-field";
import { FormControlLabel } from "./form-control-label";

export type FormControlComposite = {
  Label: typeof FormControlLabel;
  Field: typeof FormControlField;
  Description: typeof FormControlDescription;
  ErrorMessage: typeof FormControlErrorMessage;
};

export interface FormControlProps {
  /**
   * The name of the form control.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;

  /** Whether the form control should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must fill the form control before the owning form can be submitted. */
  isRequired?: boolean;

  /** Whether the form control is disabled. */
  isDisabled?: boolean;

  /** Whether the form control is read only. */
  isReadOnly?: boolean;

  /** Whether the form control itself is the field (ex: radio group). */
  isField?: boolean;
}

export const FormControl = createPolymorphicComponent<
  "div",
  FormControlProps,
  FormControlComposite
>(props => {
  const defaultId = `form-control-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "children",
    "name",
    "validationState",
    "isRequired",
    "isDisabled",
    "isReadOnly",
    "isField",
    "aria-labelledby",
    "aria-describedby",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const [fieldId, setFieldId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();
  const [errorMessageId, setErrorMessageId] = createSignal<string>();

  const ariaLabelledBy = () => {
    if (local.isField) {
      const hasAriaLabelledBy = local["aria-labelledby"] != null || labelId() != null;

      return (
        [
          local["aria-labelledby"],
          labelId(),
          // If there is both an aria-label and aria-labelledby, add the field itself has an aria-labelledby
          hasAriaLabelledBy && others["aria-label"] != null ? others.id : undefined,
        ]
          .filter(Boolean)
          .join(" ") || undefined
      );
    }

    return local["aria-labelledby"];
  };

  const ariaDescribedBy = () => {
    if (local.isField) {
      return (
        [
          descriptionId(),
          // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
          // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
          errorMessageId(),
          local["aria-describedby"],
        ]
          .filter(Boolean)
          .join(" ") || undefined
      );
    }

    return local["aria-describedby"];
  };

  const dataset: Accessor<FormControlDataSet> = createMemo(() => ({
    "data-valid": local.validationState === "valid" ? "" : undefined,
    "data-invalid": local.validationState === "invalid" ? "" : undefined,
    "data-required": local.isRequired ? "" : undefined,
    "data-disabled": local.isDisabled ? "" : undefined,
    "data-readonly": local.isReadOnly ? "" : undefined,
  }));

  const context: FormControlContextValue = {
    name: () => local.name ?? others.id!,
    dataset,
    validationState: () => local.validationState,
    isRequired: () => local.isRequired,
    isDisabled: () => local.isDisabled,
    isReadOnly: () => local.isReadOnly,
    labelId,
    fieldId,
    descriptionId,
    errorMessageId,
    ariaDescribedBy,
    generateId: part => `${others.id!}-${part}`,
    registerLabel: id => {
      setLabelId(id);
      return () => setLabelId(undefined);
    },
    registerField: id => {
      setFieldId(id);
      return () => setFieldId(undefined);
    },
    registerDescription: id => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    },
    registerErrorMessage: id => {
      setErrorMessageId(id);
      return () => setErrorMessageId(undefined);
    },
  };

  return (
    <Dynamic
      component={local.as}
      aria-labelledby={ariaLabelledBy()}
      aria-describedby={ariaDescribedBy()}
      {...dataset()}
      {...others}
    >
      <FormControlContext.Provider value={context}>{local.children}</FormControlContext.Provider>
    </Dynamic>
  );
});

FormControl.Label = FormControlLabel;
FormControl.Field = FormControlField;
FormControl.Description = FormControlDescription;
FormControl.ErrorMessage = FormControlErrorMessage;
