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
  /** The controlled selected state. */
  selected?: MaybeAccessor<boolean | undefined>;

  /**
   * The default selected state when initially rendered.
   * Useful when you do not need to control the selected state.
   */
  defaultSelected?: MaybeAccessor<boolean | undefined>;

  /** Whether the selected state cannot be changed by the user. */
  readOnly?: MaybeAccessor<boolean | undefined>;

  /** Event handler called when the selected state changes. */
  onSelectedChange?: (selected: boolean) => void;
}

export interface ToggleState {
  /** The selected state. */
  selected: Accessor<boolean>;

  /** Updates the selected state. */
  setSelected: (selected: boolean) => void;

  /** Toggle the selected state. */
  toggle: () => void;
}

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(props: CreateToggleStateProps = {}): ToggleState {
  const [selected, _setSelected] = createControllableBooleanSignal({
    value: () => access(props.selected),
    defaultValue: () => !!access(props.defaultSelected),
    onChange: value => props.onSelectedChange?.(value),
  });

  const setSelected = (value: boolean) => {
    if (!access(props.readOnly)) {
      _setSelected(value);
    }
  };

  const toggle = () => {
    if (!access(props.readOnly)) {
      _setSelected(!selected());
    }
  };

  return {
    selected,
    setSelected,
    toggle,
  };
}
