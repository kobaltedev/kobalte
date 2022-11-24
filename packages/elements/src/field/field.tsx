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

import { FieldContext, FieldContextValue, FieldDataSet } from "./field-context";
import { FieldDescription } from "./field-description";
import { FieldErrorMessage } from "./field-error-message";
import { FieldLabel } from "./field-label";

type FieldComposite = {
  Label: typeof FieldLabel;
  Description: typeof FieldDescription;
  ErrorMessage: typeof FieldErrorMessage;
};

export interface FieldProps {
  /**
   * The name of the field.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;

  /** Whether the field should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must fill the field before the owning form can be submitted. */
  isRequired?: boolean;

  /** Whether the field is disabled. */
  isDisabled?: boolean;

  /** Whether the field is read only. */
  isReadOnly?: boolean;
}

export const Field = createPolymorphicComponent<"div", FieldProps, FieldComposite>(props => {
  const defaultId = `kb-field-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
      name: defaultId,
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
    "aria-labelledby",
    "aria-describedby",
  ]);

  const [labelId, setLabelId] = createSignal<string>();
  const [inputId, setInputId] = createSignal<string>();
  const [descriptionId, setDescriptionId] = createSignal<string>();
  const [errorMessageId, setErrorMessageId] = createSignal<string>();

  const allAriaLabelledBy = createMemo(() => {
    return [labelId(), local["aria-labelledby"]].filter(Boolean).join(" ") || undefined;
  });

  const allAriaDescribedBy = createMemo(() => {
    // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
    // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
    return (
      [descriptionId(), errorMessageId(), local["aria-describedby"]].filter(Boolean).join(" ") ||
      undefined
    );
  });

  const dataset: Accessor<FieldDataSet> = createMemo(() => ({
    "data-valid": local.validationState === "valid" ? "" : undefined,
    "data-invalid": local.validationState === "invalid" ? "" : undefined,
    "data-required": local.isRequired ? "" : undefined,
    "data-disabled": local.isDisabled ? "" : undefined,
    "data-readonly": local.isReadOnly ? "" : undefined,
  }));

  const context: FieldContextValue = {
    name: () => local.name!,
    dataset,
    validationState: () => local.validationState,
    isRequired: () => local.isRequired,
    isDisabled: () => local.isDisabled,
    isReadOnly: () => local.isReadOnly,
    inputId,
    generateFieldPartId: part => `${local.id!}-${part}`,
    registerFieldLabel: id => {
      setLabelId(id);
      return () => setLabelId(undefined);
    },
    registerFieldInput: id => {
      setInputId(id);
      return () => setInputId(undefined);
    },
    registerFieldDescription: id => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    },
    registerFieldErrorMessage: id => {
      setErrorMessageId(id);
      return () => setErrorMessageId(undefined);
    },
  };

  return (
    <Dynamic component={local.as} id={local.id} {...others}>
      <FieldContext.Provider value={context}>{local.children}</FieldContext.Provider>
    </Dynamic>
  );
});

Field.Label = FieldLabel;
Field.Description = FieldDescription;
Field.ErrorMessage = FieldErrorMessage;
