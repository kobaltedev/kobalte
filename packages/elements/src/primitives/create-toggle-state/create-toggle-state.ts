/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-stately/toggle/src/useToggleState.ts
 */

import { access, MaybeAccessor } from "@kobalte/utils";
import { Accessor } from "solid-js";

import { createControllableBooleanSignal } from "../create-controllable-signal";

export interface CreateToggleStateProps {
  /** The controlled checked state. */
  checked?: MaybeAccessor<boolean | undefined>;

  /**
   * The default checked state when initially rendered.
   * Useful when you do not need to control the checked state.
   */
  defaultChecked?: MaybeAccessor<boolean | undefined>;

  /** Whether the checked state cannot be changed by the user. */
  readOnly?: MaybeAccessor<boolean | undefined>;

  /** Event handler called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
}

export interface ToggleState {
  /** The checked state. */
  checked: Accessor<boolean>;

  /** Updates the checked state. */
  setChecked: (checked: boolean) => void;

  /** Toggle the checked state. */
  toggleChecked: () => void;
}

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(props: CreateToggleStateProps = {}): ToggleState {
  const [checked, _setChecked] = createControllableBooleanSignal({
    value: () => access(props.checked),
    defaultValue: () => !!access(props.defaultChecked),
    onChange: value => props.onCheckedChange?.(value),
  });

  const setChecked = (value: boolean) => {
    if (!access(props.readOnly)) {
      _setChecked(value);
    }
  };

  const toggleChecked = () => {
    if (!access(props.readOnly)) {
      _setChecked(!checked());
    }
  };

  return {
    checked,
    setChecked,
    toggleChecked,
  };
}
