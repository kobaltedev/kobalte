import {
  access,
  createGenerateId,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
  ValidationState,
} from "@kobalte/utils";
import { createUniqueId, JSX, splitProps } from "solid-js";

import { createFormControl, FORM_CONTROL_PROP_NAMES, FormControlContext } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { createControllableSignal, createFormResetListener } from "../primitives";
import { TextFieldContext, TextFieldContextValue } from "./text-field-context";

export interface TextFieldRootOptions extends AsChildProp {
  /** The controlled value of the textfield. */
  value?: string;

  /**
   * The default value when initially rendered.
   * Useful when you do not need to control the value.
   */
  defaultValue?: string;

  /** Event handler called when the value of the textfield changes. */
  onChange?: (value: string) => void;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /**
   * The name of the textfield.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;

  /** Whether the textfield should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must fill the textfield before the owning form can be submitted. */
  required?: boolean;

  /** Whether the textfield is disabled. */
  disabled?: boolean;

  /** Whether the textfield is read only. */
  readOnly?: boolean;
}

export interface TextFieldRootProps extends OverrideComponentProps<"div", TextFieldRootOptions> {}

/**
 * A text input that allow users to input custom text entries with a keyboard.
 */
export function TextFieldRoot(props: TextFieldRootProps) {
  let ref: HTMLDivElement | undefined;

  const defaultId = `textfield-${createUniqueId()}`;

  props = mergeDefaultProps({ id: defaultId }, props);

  const [local, formControlProps, others] = splitProps(
    props,
    ["ref", "value", "defaultValue", "onChange"],
    FORM_CONTROL_PROP_NAMES
  );

  const [value, setValue] = createControllableSignal({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onChange?.(value),
  });

  const { formControlContext } = createFormControl(formControlProps);

  createFormResetListener(
    () => ref,
    () => setValue(local.defaultValue ?? "")
  );

  const onInput: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, InputEvent> = e => {
    if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
      return;
    }

    const target = e.target as HTMLInputElement | HTMLTextAreaElement;

    setValue(target.value);

    // Unlike in React, inputs `value` can be out of sync with our value state.
    // even if an input is controlled (ex: `<input value="foo" />`,
    // typing on the input will change its internal `value`.
    //
    // To prevent this, we need to force the input `value` to be in sync with the textfield value state.
    target.value = value() ?? "";
  };

  const context: TextFieldContextValue = {
    value,
    generateId: createGenerateId(() => access(formControlProps.id)!),
    onInput,
  };

  return (
    <FormControlContext.Provider value={formControlContext}>
      <TextFieldContext.Provider value={context}>
        <Polymorphic
          as="div"
          ref={mergeRefs(el => (ref = el), local.ref)}
          role="group"
          id={access(formControlProps.id)}
          {...formControlContext.dataset()}
          {...others}
        />
      </TextFieldContext.Provider>
    </FormControlContext.Provider>
  );
}
