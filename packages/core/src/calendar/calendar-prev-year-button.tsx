/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/15e101b74966bd5eb719c6529ce71ce57eaed430/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { callHandler, createPolymorphicComponent } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { Button, ButtonOptions } from "../button";
import { createLocalizedStringFormatter } from "../i18n";
import { PressEvents } from "../primitives";
import { CALENDAR_INTL_MESSAGES } from "./calendar.intl";
import { useCalendarContext } from "./calendar-context";

export const CalendarPrevYearButton = createPolymorphicComponent<"button", ButtonOptions>(props => {
  const context = useCalendarContext();

  const [local, others] = splitProps(props, ["onPress", "onFocus", "onBlur"]);

  const stringFormatter = createLocalizedStringFormatter(() => CALENDAR_INTL_MESSAGES);

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    context.calendarState().focusPreviousYear();
  };

  const onFocus: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onFocus);
    context.setPreviousFocused(true);
  };

  const onBlur: JSX.EventHandlerUnion<any, FocusEvent> = e => {
    callHandler(e, local.onBlur);
    context.setPreviousFocused(false);
  };

  return (
    <Button
      isDisabled={context.isPreviousDisabled()}
      aria-label={stringFormatter().format("previousYear")}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      {...others}
    />
  );
});
