/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/3155e4db7eba07cf06525747ce0adb54c1e2a086/packages/@react-aria/switch/src/useSwitch.ts
 */

import { combineProps, mergeDefaultProps, OverrideProps, ValidationState } from "@kobalte/utils";
import {
  Accessor,
  Component,
  ComponentProps,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from "solid-js";

import { createFormResetListener, createHover, createToggleState } from "../primitives";
import { SwitchContext, SwitchContextValue, SwitchDataSet } from "./switch-context";
import { SwitchControl } from "./switch-control";
import { SwitchInput } from "./switch-input";
import { SwitchLabel } from "./switch-label";
import { SwitchThumb } from "./switch-thumb";

type SwitchComposite = {
  Label: typeof SwitchLabel;
  Input: typeof SwitchInput;
  Control: typeof SwitchControl;
  Thumb: typeof SwitchThumb;
};

export interface SwitchOptions {
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
export const Switch: Component<OverrideProps<ComponentProps<"label">, SwitchOptions>> &
  SwitchComposite = props => {
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
    "value",
    "isChecked",
    "defaultIsChecked",
    "onCheckedChange",
    "name",
    "value",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "aria-errormessage",
    "validationState",
    "isRequired",
    "isDisabled",
    "isReadOnly",
  ]);

  const [isFocused, setIsFocused] = createSignal(false);
  const [isFocusVisible, setIsFocusVisible] = createSignal(false);

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

  const { isHovered, hoverHandlers } = createHover({
    isDisabled: () => local.isDisabled,
  });

  const dataset: Accessor<SwitchDataSet> = createMemo(() => ({
    "data-valid": local.validationState === "valid" ? "" : undefined,
    "data-invalid": local.validationState === "invalid" ? "" : undefined,
    "data-checked": state.isSelected() ? "" : undefined,
    "data-required": local.isRequired ? "" : undefined,
    "data-disabled": local.isDisabled ? "" : undefined,
    "data-readonly": local.isReadOnly ? "" : undefined,
    "data-hover": isHovered() ? "" : undefined,
    "data-focus": isFocused() ? "" : undefined,
    "data-focus-visible": isFocusVisible() ? "" : undefined,
  }));

  const context: SwitchContextValue = {
    name: () => local.name ?? others.id!,
    value: () => local.value!,
    dataset,
    ariaLabel: () => local["aria-label"],
    ariaLabelledBy: () => local["aria-labelledby"],
    ariaDescribedBy: () => local["aria-describedby"],
    ariaErrorMessage: () => local["aria-errormessage"],
    validationState: () => local.validationState,
    isChecked: () => state.isSelected(),
    isRequired: () => local.isRequired,
    isDisabled: () => local.isDisabled,
    isReadOnly: () => local.isReadOnly,
    generateId: part => `${others.id!}-${part}`,
    setIsChecked: isChecked => state.setIsSelected(isChecked),
    setIsFocused,
    setIsFocusVisible,
  };

  return (
    <SwitchContext.Provider value={context}>
      <label
        {...context.dataset()}
        {...combineProps({ ref: el => (ref = el) }, others, hoverHandlers)}
      />
    </SwitchContext.Provider>
  );
};

Switch.Label = SwitchLabel;
Switch.Input = SwitchInput;
Switch.Control = SwitchControl;
Switch.Thumb = SwitchThumb;
