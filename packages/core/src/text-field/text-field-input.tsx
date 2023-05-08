/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-aria/textfield/src/useTextField.ts
 */

import { composeEventHandlers, mergeDefaultProps, OverrideComponentProps } from "@kobalte/utils";
import { splitProps } from "solid-js";

import {
  createFormControlField,
  FORM_CONTROL_FIELD_PROP_NAMES,
  useFormControlContext,
} from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { useTextFieldContext } from "./text-field-context";

export interface TextFieldInputProps extends OverrideComponentProps<"input", AsChildProp> {}

/**
 * The native html input of the textfield.
 */
export function TextFieldInput(props: TextFieldInputProps) {
  return <TextFieldInputBase type="text" {...props} />;
}

export function TextFieldInputBase(props: TextFieldInputProps) {
  const formControlContext = useFormControlContext();
  const context = useTextFieldContext();

  props = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );

  const [local, formControlFieldProps, others] = splitProps(
    props,
    ["onInput"],
    FORM_CONTROL_FIELD_PROP_NAMES
  );

  const { fieldProps } = createFormControlField(formControlFieldProps);

  return (
    <Polymorphic
      as="input"
      id={fieldProps.id()}
      name={formControlContext.name()}
      value={context.value()}
      required={formControlContext.isRequired()}
      disabled={formControlContext.isDisabled()}
      readonly={formControlContext.isReadOnly()}
      aria-label={fieldProps.ariaLabel()}
      aria-labelledby={fieldProps.ariaLabelledBy()}
      aria-describedby={fieldProps.ariaDescribedBy()}
      aria-invalid={formControlContext.validationState() === "invalid" || undefined}
      aria-required={formControlContext.isRequired() || undefined}
      aria-disabled={formControlContext.isDisabled() || undefined}
      aria-readonly={formControlContext.isReadOnly() || undefined}
      onInput={composeEventHandlers([local.onInput, context.onInput])}
      {...formControlContext.dataset()}
      {...others}
    />
  );
}
