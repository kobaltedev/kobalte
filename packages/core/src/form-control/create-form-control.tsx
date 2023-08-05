/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/label/src/useField.ts
 */

import {
  access,
  createGenerateId,
  MaybeAccessor,
  mergeDefaultProps,
  ValidationState,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId } from "solid-js";

import { createRegisterId } from "../primitives";
import { FormControlContextValue, FormControlDataSet } from "./form-control-context";

export interface CreateFormControlProps {
  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: MaybeAccessor<string | undefined>;

  /**
   * The name of the form control.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: MaybeAccessor<string | undefined>;

  /** Whether the form control should display its "valid" or "invalid" visual styling. */
  validationState?: MaybeAccessor<ValidationState | undefined>;

  /** Whether the user must fill the form control before the owning form can be submitted. */
  required?: MaybeAccessor<boolean | undefined>;

  /** Whether the form control is disabled. */
  disabled?: MaybeAccessor<boolean | undefined>;

  /** Whether the form control is read only. */
  readOnly?: MaybeAccessor<boolean | undefined>;
}

export const FORM_CONTROL_PROP_NAMES = [
  "id",
  "name",
  "validationState",
  "required",
  "disabled",
  "readOnly",
] as const;

export function createFormControl(props: CreateFormControlProps) {
  const defaultId = `form-control-${createUniqueId()}`;

  props = mergeDefaultProps({ id: defaultId }, props);

  const [labelId, setLabelId] = createSignal<string>();
  const [fieldId, setFieldId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();
  const [errorMessageId, setErrorMessageId] = createSignal<string>();

  const getAriaLabelledBy = (
    fieldId: string | undefined,
    fieldAriaLabel: string | undefined,
    fieldAriaLabelledBy: string | undefined
  ) => {
    const hasAriaLabelledBy = fieldAriaLabelledBy != null || labelId() != null;

    return (
      [
        fieldAriaLabelledBy,
        labelId(),
        // If there is both an aria-label and aria-labelledby, add the field itself has an aria-labelledby
        hasAriaLabelledBy && fieldAriaLabel != null ? fieldId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const getAriaDescribedBy = (fieldAriaDescribedBy: string | undefined) => {
    return (
      [
        descriptionId(),
        // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
        // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
        errorMessageId(),
        fieldAriaDescribedBy,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const dataset: Accessor<FormControlDataSet> = createMemo(() => ({
    "data-valid": access(props.validationState) === "valid" ? "" : undefined,
    "data-invalid": access(props.validationState) === "invalid" ? "" : undefined,
    "data-required": access(props.required) ? "" : undefined,
    "data-disabled": access(props.disabled) ? "" : undefined,
    "data-readonly": access(props.readOnly) ? "" : undefined,
  }));

  const formControlContext: FormControlContextValue = {
    name: () => access(props.name) ?? access(props.id)!,
    dataset,
    validationState: () => access(props.validationState),
    isRequired: () => access(props.required),
    isDisabled: () => access(props.disabled),
    isReadOnly: () => access(props.readOnly),
    labelId,
    fieldId,
    descriptionId,
    errorMessageId,
    getAriaLabelledBy,
    getAriaDescribedBy,
    generateId: createGenerateId(() => access(props.id)!),
    registerLabel: createRegisterId(setLabelId),
    registerField: createRegisterId(setFieldId),
    registerDescription: createRegisterId(setDescriptionId),
    registerErrorMessage: createRegisterId(setErrorMessageId),
  };

  return { formControlContext };
}
