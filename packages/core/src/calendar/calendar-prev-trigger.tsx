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
import { isPreviousVisibleRangeInvalid } from "./utils";

export interface CalendarPrevTriggerOptions extends Button.ButtonRootOptions {}

export type CalendarPrevTriggerProps = OverrideComponentProps<"button", CalendarPrevTriggerOptions>;

export function CalendarPrevTrigger(props: CalendarPrevTriggerProps) {
  const context = useCalendarContext();

  const [local, others] = splitProps(props, ["disabled", "onClick", "onFocus", "onBlur"]);

  let prevTriggerFocused = false;

  const prevTriggerDisabled = createMemo(() => {
    return (
      local.disabled ||
      context.isDisabled() ||
      isPreviousVisibleRangeInvalid(context.startDate(), context.min(), context.max())
    );
  });

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = e => {
    callHandler(e, local.onClick);
    context.focusPreviousPage();
  };

  const onFocus: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onFocus);
    prevTriggerFocused = true;
  };

  const onBlur: JSX.FocusEventHandlerUnion<HTMLButtonElement, FocusEvent> = e => {
    callHandler(e, local.onBlur);
    prevTriggerFocused = false;
  };

  // If the prev trigger become disabled while they are focused, move focus to the calendar body.
  createEffect(() => {
    if (prevTriggerDisabled() && prevTriggerFocused) {
      prevTriggerFocused = false;
      context.setIsFocused(true);
    }
  });

  return (
    <Button.Root
      disabled={prevTriggerDisabled()}
      aria-label={context.messageFormatter().format("previous")}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      {...others}
    />
  );
}
