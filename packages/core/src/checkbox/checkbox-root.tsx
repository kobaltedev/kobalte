/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/checkbox/src/useCheckbox.ts
 */

import {
  callHandler,
  createGenerateId,
  isFunction,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
  ValidationState,
} from "@kobalte/utils";
import {
  Accessor,
  children,
  createMemo,
  createSignal,
  createUniqueId,
  JSX,
  splitProps,
} from "solid-js";

import { createFormResetListener, createToggleState } from "../primitives";
import { CheckboxContext, CheckboxContextValue, CheckboxDataSet } from "./checkbox-context";

interface CheckboxRootState {
  /** Whether the checkbox is checked or not. */
  checked: Accessor<boolean>;

  /** Whether the checkbox is in an indeterminate state. */
  indeterminate: Accessor<boolean>;
}

export interface CheckboxRootOptions {
  /** The controlled checked state of the checkbox. */
  checked?: boolean;

  /**
   * The default checked state when initially rendered.
   * Useful when you do not need to control the checked state.
   */
  defaultChecked?: boolean;

  /** Event handler called when the checked state of the checkbox changes. */
  onChange?: (checked: boolean) => void;

  /**
   * Whether the checkbox is in an indeterminate state.
   * Indeterminism is presentational only.
   * The indeterminate visual representation remains regardless of user interaction.
   */
  indeterminate?: boolean;

  /**
   * The name of the checkbox, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string;

  /**
   * The value of the checkbox, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string;

  /** Whether the checkbox should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must check the checkbox before the owning form can be submitted. */
  required?: boolean;

  /** Whether the checkbox is disabled. */
  disabled?: boolean;

  /** Whether the checkbox is read only. */
  readOnly?: boolean;

  /**
   * The children of the checkbox.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: CheckboxRootState) => JSX.Element);
}

export interface CheckboxRootProps extends OverrideComponentProps<"label", CheckboxRootOptions> {}

/**
 * A control that allows the user to toggle between checked and not checked.
 */
export function CheckboxRoot(props: CheckboxRootProps) {
  let ref: HTMLLabelElement | undefined;

  const defaultId = `checkbox-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      value: "on",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
    "children",
    "value",
    "checked",
    "defaultChecked",
    "onChange",
    "name",
    "value",
    "validationState",
    "required",
    "disabled",
    "readOnly",
    "indeterminate",
    "onPointerDown",
  ]);

  const [isFocused, setIsFocused] = createSignal(false);

  const state = createToggleState({
    isSelected: () => local.checked,
    defaultIsSelected: () => local.defaultChecked,
    onSelectedChange: selected => local.onChange?.(selected),
    isDisabled: () => local.disabled,
    isReadOnly: () => local.readOnly,
  });

  createFormResetListener(
    () => ref,
    () => state.setIsSelected(local.defaultChecked ?? false)
  );

  const onPointerDown: JSX.EventHandlerUnion<any, PointerEvent> = e => {
    callHandler(e, local.onPointerDown);

    // For consistency with native, prevent the input blurs on pointer down.
    if (isFocused()) {
      e.preventDefault();
    }
  };

  const dataset: Accessor<CheckboxDataSet> = createMemo(() => ({
    "data-valid": local.validationState === "valid" ? "" : undefined,
    "data-invalid": local.validationState === "invalid" ? "" : undefined,
    "data-checked": state.isSelected() ? "" : undefined,
    "data-indeterminate": local.indeterminate ? "" : undefined,
    "data-required": local.required ? "" : undefined,
    "data-disabled": local.disabled ? "" : undefined,
    "data-readonly": local.readOnly ? "" : undefined,
  }));

  const context: CheckboxContextValue = {
    name: () => local.name ?? others.id!,
    value: () => local.value!,
    dataset,
    validationState: () => local.validationState,
    checked: () => state.isSelected(),
    required: () => local.required ?? false,
    disabled: () => local.disabled ?? false,
    readOnly: () => local.readOnly ?? false,
    indeterminate: () => local.indeterminate ?? false,
    generateId: createGenerateId(() => others.id!),
    setIsChecked: isChecked => state.setIsSelected(isChecked),
    setIsFocused,
  };

  return (
    <CheckboxContext.Provider value={context}>
      <label
        ref={mergeRefs(el => (ref = el), local.ref)}
        onPointerDown={onPointerDown}
        {...dataset()}
        {...others}
      >
        <CheckboxRootChild state={context} children={local.children} />
      </label>
    </CheckboxContext.Provider>
  );
}

interface CheckboxRootChildProps extends Pick<CheckboxRootOptions, "children"> {
  state: CheckboxRootState;
}

function CheckboxRootChild(props: CheckboxRootChildProps) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });

  return <>{resolvedChildren()}</>;
}
