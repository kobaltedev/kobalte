/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
 */

import {
  callHandler,
  createGenerateId,
  mergeDefaultProps,
  mergeRefs,
  OverrideComponentProps,
  ValidationState,
} from "@kobalte/utils";
import { Accessor, createMemo, createSignal, createUniqueId, JSX, splitProps } from "solid-js";

import { createFormResetListener, createToggleState } from "../primitives";
import { SwitchContext, SwitchContextValue, SwitchDataSet } from "./switch-context";

export interface SwitchRootOptions {
  /** The controlled checked state of the switch. */
  checked?: boolean;

  /**
   * The default checked state when initially rendered.
   * Useful when you do not need to control the checked state.
   */
  defaultChecked?: boolean;

  /** Event handler called when the checked state of the switch changes. */
  onChange?: (isChecked: boolean) => void;

  /**
   * The name of the switch, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string;

  /**
   * The value of the switch, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string;

  /** Whether the switch should display its "valid" or "invalid" visual styling. */
  validationState?: ValidationState;

  /** Whether the user must check the switch before the owning form can be submitted. */
  required?: boolean;

  /** Whether the switch is disabled. */
  disabled?: boolean;

  /** Whether the switch is read only. */
  readOnly?: boolean;
}

export interface SwitchRootProps extends OverrideComponentProps<"label", SwitchRootOptions> {}

/**
 * A control that allows users to choose one of two values: on or off.
 */
export function SwitchRoot(props: SwitchRootProps) {
  let ref: HTMLLabelElement | undefined;

  const defaultId = `switch-${createUniqueId()}`;

  props = mergeDefaultProps(
    {
      value: "on",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "ref",
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

  const dataset: Accessor<SwitchDataSet> = createMemo(() => ({
    "data-valid": local.validationState === "valid" ? "" : undefined,
    "data-invalid": local.validationState === "invalid" ? "" : undefined,
    "data-checked": state.isSelected() ? "" : undefined,
    "data-required": local.required ? "" : undefined,
    "data-disabled": local.disabled ? "" : undefined,
    "data-readonly": local.readOnly ? "" : undefined,
  }));

  const context: SwitchContextValue = {
    name: () => local.name ?? others.id!,
    value: () => local.value!,
    dataset,
    validationState: () => local.validationState,
    isChecked: () => state.isSelected(),
    isRequired: () => local.required,
    isDisabled: () => local.disabled,
    isReadOnly: () => local.readOnly,
    generateId: createGenerateId(() => others.id!),
    setIsChecked: isChecked => state.setIsSelected(isChecked),
    setIsFocused,
  };

  return (
    <SwitchContext.Provider value={context}>
      <label
        ref={mergeRefs(el => (ref = el), local.ref)}
        onPointerDown={onPointerDown}
        {...dataset()}
        {...others}
      />
    </SwitchContext.Provider>
  );
}
