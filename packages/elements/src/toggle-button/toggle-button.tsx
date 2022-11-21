/*!
 * Portions of this file are based on code from radix-ui.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the radix-ui team:
 * https://github.com/radix-ui/primitives/blob/02b036d4181131dfc0224044ba5f17d260bce2f8/packages/react/toggle/src/Toggle.tsx
 *
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a13802d8be6f83af1450e56f7a88527b10d9cadf/packages/@react-aria/button/src/useToggleButton.ts
 */

import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { createToggleState, PressEvents } from "../primitives";

export interface ToggleButtonProps extends ButtonProps {
  /** The controlled selected state. */
  isSelected?: boolean;

  /**
   * The default selected state when initially rendered.
   * Useful when you do not need to control the selected state.
   */
  defaultIsSelected?: boolean;

  /** Event handler called when the selected state changes. */
  onSelectedChange?: (isSelected: boolean) => void;
}

/**
 * A two-state button that allow users to toggle a selection on or off.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export const ToggleButton = createPolymorphicComponent<"button", ToggleButtonProps>(props => {
  const [local, others] = splitProps(props, [
    "isSelected",
    "defaultIsSelected",
    "onSelectedChange",
    "onPress",
  ]);

  const state = createToggleState({
    isSelected: () => local.isSelected,
    defaultIsSelected: () => local.defaultIsSelected,
    onSelectedChange: selected => local.onSelectedChange?.(selected),
  });

  const onPress: PressEvents["onPress"] = e => {
    state.toggle();
    local.onPress?.(e);
  };

  return (
    <Button
      aria-pressed={state.isSelected()}
      data-selected={state.isSelected() ? "" : undefined}
      onPress={onPress}
      {...others}
    />
  );
});
