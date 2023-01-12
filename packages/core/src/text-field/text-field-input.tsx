/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0af91c08c745f4bb35b6ad4932ca17a0d85dd02c/packages/@react-aria/textfield/src/useTextField.ts
 */

import { composeEventHandlers, mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps, splitProps } from "solid-js";

import {
  createFormControlField,
  FORM_CONTROL_FIELD_PROP_NAMES,
  useFormControlContext,
} from "../form-control";
import { createFocusRing, FOCUS_RING_HANDLERS_PROP_NAMES } from "../primitives";
import { useTextFieldContext } from "./text-field-context";

/**
 * The native html input of the textfield.
 */
export function TextFieldInput(props: ComponentProps<"input">) {
  const formControlContext = useFormControlContext();
  const context = useTextFieldContext();

  props = mergeDefaultProps({ id: context.generateId("input") }, props);

  const [local, formControlFieldProps, others] = splitProps(
    props,
    ["onInput", ...FOCUS_RING_HANDLERS_PROP_NAMES],
    FORM_CONTROL_FIELD_PROP_NAMES
  );

  const { fieldProps } = createFormControlField(formControlFieldProps);

  const { focusRingHandlers } = createFocusRing({
    onFocusChange: value => context.setIsFocused(value),
    onFocusVisibleChange: value => context.setIsFocusVisible(value),
  });

  return (
    <input
      type="text"
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
      onFocusIn={composeEventHandlers([local.onFocusIn, focusRingHandlers.onFocusIn])}
      onFocusOut={composeEventHandlers([local.onFocusOut, focusRingHandlers.onFocusOut])}
      {...others}
    />
  );
}
