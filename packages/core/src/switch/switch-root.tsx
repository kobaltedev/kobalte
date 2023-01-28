/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
 */

import { mergeDefaultProps, mergeRefs, OverrideProps, ValidationState } from "@kobalte/utils";
import {
  Accessor,
  Component,
  ComponentProps,
  createMemo,
  createUniqueId,
  splitProps,
} from "solid-js";

import { createFormResetListener, createToggleState } from "../primitives";
import { SwitchContext, SwitchContextValue, SwitchDataSet } from "./switch-context";

export interface SwitchRootOptions {
  /** The controlled checked state of the switch. */
  isChecked?: boolean;

  /**
   * The default checked state when initially rendered.
   * Useful when you do not need to control the checked state.
   */
  defaultIsChecked?: boolean;

  /** Event handler called when the checked state of the switch changes. */
  onCheckedChange?: (isChecked: boolean) => void;

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
  isRequired?: boolean;

  /** Whether the switch is disabled. */
  isDisabled?: boolean;

  /** Whether the switch is read only. */
  isReadOnly?: boolean;
}

/**
 * A control that allows users to choose one of two values: on or off.
 */
export const SwitchRoot: Component<
  OverrideProps<ComponentProps<"label">, SwitchRootOptions>
> = props => {
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
    "isChecked",
    "defaultIsChecked",
    "onCheckedChange",
    "name",
    "value",
    "validationState",
    "isRequired",
    "isDisabled",
    "isReadOnly",
  ]);

  const state = createToggleState({
    isSelected: () => local.isChecked,
    defaultIsSelected: () => local.defaultIsChecked,
    onSelectedChange: selected => local.onCheckedChange?.(selected),
    isDisabled: () => local.isDisabled,
    isReadOnly: () => local.isReadOnly,
  });

  createFormResetListener(
    () => ref,
    () => state.setIsSelected(local.defaultIsChecked ?? false)
  );

  //TODO: For consistency with native, prevent the input blurs on pointer down on root.

  const dataset: Accessor<SwitchDataSet> = createMemo(() => ({
    "data-valid": local.validationState === "valid" ? "" : undefined,
    "data-invalid": local.validationState === "invalid" ? "" : undefined,
    "data-checked": state.isSelected() ? "" : undefined,
    "data-required": local.isRequired ? "" : undefined,
    "data-disabled": local.isDisabled ? "" : undefined,
    "data-readonly": local.isReadOnly ? "" : undefined,
  }));

  const context: SwitchContextValue = {
    name: () => local.name ?? others.id!,
    value: () => local.value!,
    dataset,
    validationState: () => local.validationState,
    isChecked: () => state.isSelected(),
    isRequired: () => local.isRequired,
    isDisabled: () => local.isDisabled,
    isReadOnly: () => local.isReadOnly,
    generateId: part => `${others.id!}-${part}`,
    setIsChecked: isChecked => state.setIsSelected(isChecked),
  };

  return (
    <SwitchContext.Provider value={context}>
      <label ref={mergeRefs(el => (ref = el), local.ref)} {...context.dataset()} {...others} />
    </SwitchContext.Provider>
  );
};
