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
import { FormControlLabel } from "./form-control-label";

export type FormControlComposite = {
  Label: typeof FormControlLabel;
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
  const defaultId = `kb-form-control-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "as",
    "ref",
    "children",
    "id",
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

  const mergeAriaLabelledBy = (ids: string[] = []) => {
    // If the form control is the field and has "aria-label", add itself to "aria-labelledby"
    const isSelfLabelled = local.isField && others["aria-label"] != null;

    return (
      [labelId(), isSelfLabelled && local.id, local["aria-labelledby"], ...ids]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const mergeAriaDescribedBy = (ids: string[] = []) => {
    // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
    // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
    return (
      [descriptionId(), errorMessageId(), local["aria-describedby"], ...ids]
        .filter(Boolean)
        .join(" ") || undefined
    );
  };

  const dataset: Accessor<FormControlDataSet> = createMemo(() => ({
    "data-valid": local.validationState === "valid" ? "" : undefined,
    "data-invalid": local.validationState === "invalid" ? "" : undefined,
    "data-required": local.isRequired ? "" : undefined,
    "data-disabled": local.isDisabled ? "" : undefined,
    "data-readonly": local.isReadOnly ? "" : undefined,
  }));

  const context: FormControlContextValue = {
    name: () => local.name ?? local.id!,
    dataset,
    validationState: () => local.validationState,
    isRequired: () => local.isRequired,
    isDisabled: () => local.isDisabled,
    isReadOnly: () => local.isReadOnly,
    fieldId,
    generateId: part => `${local.id!}-${part}`,
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
    mergeAriaLabelledBy,
    mergeAriaDescribedBy,
  };

  return (
    <Dynamic
      component={local.as}
      id={local.id}
      aria-labelledby={local.isField ? mergeAriaLabelledBy() : local["aria-labelledby"]}
      aria-describedby={local.isField ? mergeAriaDescribedBy() : local["aria-describedby"]}
      {...dataset()}
      {...others}
    >
      <FormControlContext.Provider value={context}>{local.children}</FormControlContext.Provider>
    </Dynamic>
  );
});

FormControl.Label = FormControlLabel;
FormControl.Description = FormControlDescription;
FormControl.ErrorMessage = FormControlErrorMessage;
