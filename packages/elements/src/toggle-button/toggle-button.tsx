/*!
 * Portions of this file are based on code from radix-ui.
 * MIT Licensed, Copyright (c) 2022 WorkOS.
 *
 * Credits to the radix-ui team:
 * https://github.com/radix-ui/primitives/blob/02b036d4181131dfc0224044ba5f17d260bce2f8/packages/react/toggle/src/Toggle.tsx
 */

import { callHandler } from "@kobalte/utils";
import { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js/types/server/rendering";

import { createControllableBooleanSignal } from "../primitives";

export interface ToggleButtonProps extends ComponentProps<"button"> {
  /**
   * The controlled pressed state of the toggle button.
   * Must be used in conjunction with `onPressedChange`.
   */
  pressed?: boolean;

  /**
   * The default pressed state of the toggle button when initially rendered.
   * Use when you do not need to control the pressed state.
   */
  defaultPressed?: boolean;

  /** Event handler called when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
}

/**
 * A two-state button that can be either on or off.
 * This component is based on the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 */
export function ToggleButton(props: ToggleButtonProps) {
  const [local, others] = splitProps(props, [
    "pressed",
    "defaultPressed",
    "onPressedChange",
    "onClick",
  ]);

  const [pressed, setPressed] = createControllableBooleanSignal({
    value: () => local.pressed,
    defaultValue: () => !!local.defaultPressed,
    onChange: value => local.onPressedChange?.(value),
  });

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = event => {
    callHandler(local.onClick, event);

    if (!props.disabled) {
      setPressed(prev => !prev);
    }
  };

  return <button type="button" aria-pressed={pressed()} onClick={onClick} {...others} />;
}
