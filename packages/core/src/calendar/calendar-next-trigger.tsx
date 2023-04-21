/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { callHandler, OverrideComponentProps } from "@kobalte/utils";
import { createEffect, createMemo, JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { useCalendarContext } from "./calendar-context";
import { isNextVisibleRangeInvalid } from "./utils";

export interface CalendarNextTriggerOptions extends Button.ButtonRootOptions {}

export type CalendarNextTriggerProps = OverrideComponentProps<"button", CalendarNextTriggerOptions>;

export function CalendarNextTrigger(props: CalendarNextTriggerProps) {
  const context = useCalendarContext();

  const [local, others] = splitProps(props, ["disabled", "onClick", "onFocus", "onBlur"]);

  let nextTriggerFocused = false;

  const nextTriggerDisabled = createMemo(() => {
    return (
      local.disabled ||
      context.isDisabled() ||
      isNextVisibleRangeInvalid(context.endDate(), context.min(), context.max())
    );
  });

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    callHandler(e, local.onClick);
    context.focusNextPage();
  };

  const onFocus: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);
    nextTriggerFocused = true;
  };

  const onBlur: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onBlur);
    nextTriggerFocused = false;
  };

  // If the next trigger become disabled while they are focused, move focus to the calendar body.
  createEffect(() => {
    if (nextTriggerDisabled() && nextTriggerFocused) {
      nextTriggerFocused = false;
      context.setIsFocused(true);
    }
  });

  return (
    <Button.Root
      disabled={nextTriggerDisabled()}
      aria-label={context.messageFormatter().format("next")}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      {...others}
    />
  );
}
