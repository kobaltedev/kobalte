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

import { createPolymorphicComponent, isFunction } from "@kobalte/utils";
import { Accessor, children, JSX, splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { createToggleState, PressEvents } from "../primitives";

interface ToggleButtonState {
  /** Whether the toggle button is on (pressed) or off (not pressed). */
  isPressed: Accessor<boolean>;
}

export interface ToggleButtonProps extends ButtonProps {
  /** The controlled pressed state of the toggle button. */
  isPressed?: boolean;

  /**
   * The default pressed state when initially rendered.
   * Useful when you do not need to control the pressed state.
   */
  defaultIsPressed?: boolean;

  /**
   * Event handler called when the pressed state of the toggle button changes.
   * This handler is different from the `onPressChange` handler which is related to `PressEvent`.
   */
  onPressedChange?: (isPressed: boolean) => void;

  /**
   * The children of the toggle button.
   * Can be a `JSX.Element` or a _render prop_ for having access to the internal state.
   */
  children?: JSX.Element | ((state: ToggleButtonState) => JSX.Element);
}

/**
 * A two-state button that allow users to toggle a selection on or off.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export const ToggleButton = createPolymorphicComponent<"button", ToggleButtonProps>(props => {
  const [local, others] = splitProps(props, [
    "children",
    "isPressed",
    "defaultIsPressed",
    "onPressedChange",
    "onPress",
  ]);

  const state = createToggleState({
    isSelected: () => local.isPressed,
    defaultIsSelected: () => local.defaultIsPressed,
    onSelectedChange: selected => local.onPressedChange?.(selected),
    isDisabled: () => others.isDisabled,
  });

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    state.toggle();
  };

  return (
    <Button
      aria-pressed={state.isSelected()}
      data-pressed={state.isSelected() ? "" : undefined}
      onPress={onPress}
      {...others}
    >
      <ToggleButtonChild state={{ isPressed: state.isSelected }} children={local.children} />
    </Button>
  );
});

interface ToggleButtonChildProps extends Pick<ToggleButtonProps, "children"> {
  state: ToggleButtonState;
}

function ToggleButtonChild(props: ToggleButtonChildProps) {
  return children(() => {
    return isFunction(props.children) ? props.children(props.state) : props.children;
  });
}
