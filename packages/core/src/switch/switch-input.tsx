/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/toggle/src/useToggle.ts
 */

import {
  callHandler,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
  visuallyHiddenStyles,
} from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import {
  createFormControlField,
  FORM_CONTROL_FIELD_PROP_NAMES,
  useFormControlContext,
} from "../form-control";
import { useSwitchContext } from "./switch-context";

export interface SwitchInputOptions {
  /** The HTML styles attribute (object form only). */
  style?: JSX.CSSProperties;
}

export interface SwitchInputProps extends OverrideComponentProps<"input", SwitchInputOptions> {}

/**
 * The native html input that is visually hidden in the switch.
 */
export function SwitchInput(props: SwitchInputProps) {
  const formControlContext = useFormControlContext();
  const context = useSwitchContext();

  props = mergeDefaultProps({ id: context.generateId("input") }, props);

  const [local, formControlFieldProps, others] = splitProps(
    props,
    ["ref", "style", "onChange", "onFocus", "onBlur"],
    FORM_CONTROL_FIELD_PROP_NAMES,
  );

  const { fieldProps } = createFormControlField(formControlFieldProps);

  const onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = e => {
    callHandler(e, local.onChange);

    e.stopPropagation();

    const target = e.target as HTMLInputElement;

    context.setIsChecked(target.checked);

    // Unlike in React, inputs `checked` state can be out of sync with our toggle state.
    // for example a readonly `<input type="checkbox" />` is always "checkable".
    //
    // Also, even if an input is controlled (ex: `<input type="checkbox" checked={isChecked} />`,
    // clicking on the input will change its internal `checked` state.
    //
    // To prevent this, we need to force the input `checked` state to be in sync with the toggle state.
    target.checked = context.checked();
  };

  const onFocus: JSX.FocusEventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocus);
    context.setIsFocused(true);
  };

  const onBlur: JSX.FocusEventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onBlur);
    context.setIsFocused(false);
  };

  return (
    <input
      ref={mergeRefs(context.setInputRef, local.ref)}
      type="checkbox"
      role="switch"
      id={fieldProps.id()}
      name={formControlContext.name()}
      value={context.value()}
      checked={context.checked()}
      required={formControlContext.isRequired()}
      disabled={formControlContext.isDisabled()}
      readonly={formControlContext.isReadOnly()}
      style={{ ...visuallyHiddenStyles, ...local.style }}
      aria-label={fieldProps.ariaLabel()}
      aria-labelledby={fieldProps.ariaLabelledBy()}
      aria-describedby={fieldProps.ariaDescribedBy()}
      aria-invalid={formControlContext.validationState() === "invalid" || undefined}
      aria-required={formControlContext.isRequired() || undefined}
      aria-disabled={formControlContext.isDisabled() || undefined}
      aria-readonly={formControlContext.isReadOnly() || undefined}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      {...formControlContext.dataset()}
      {...context.dataset()}
      {...others}
    />
  );
}
