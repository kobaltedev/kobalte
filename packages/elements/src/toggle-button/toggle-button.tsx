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
  /** The controlled pressed state. */
  pressed?: boolean;

  /**
   * The default pressed state when initially rendered.
   * Useful when you do not need to control the pressed state.
   */
  defaultPressed?: boolean;

  /** Event handler called when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
}

/**
 * A two-state button that can be either on or off.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export const ToggleButton = createPolymorphicComponent<"button", ToggleButtonProps>(props => {
  const [local, others] = splitProps(props, [
    "pressed",
    "defaultPressed",
    "onPressedChange",
    "onPress",
  ]);

  const { checked, toggleChecked } = createToggleState({
    checked: () => local.pressed,
    defaultChecked: () => local.defaultPressed,
    onCheckedChange: checked => local.onPressedChange?.(checked),
  });

  const onPress: PressEvents["onPress"] = e => {
    toggleChecked();
    local.onPress?.(e);
  };

  return (
    <Button
      aria-pressed={checked()}
      data-state={checked() ? "on" : "off"}
      onPress={onPress}
      {...others}
    />
  );
});
