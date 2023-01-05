/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { CalendarDate } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";

export interface CalendarCellOptions {
  /** The date that this cell represents. */
  date: CalendarDate;

  /**
   * Whether the cell is disabled. By default, this is determined by the
   * Calendar's `minValue`, `maxValue`, and `isDisabled` props.
   */
  isDisabled?: boolean;
}

/**
 * Displays a date cell within a calendar grid which can be selected by the user.
 */
export const CalendarCell = createPolymorphicComponent<"td", CalendarCellOptions>(props => {
  const context = useCalendarContext();

  props = mergeDefaultProps({ as: "td" }, props);

  const [local, others] = splitProps(props, ["as", "date", "isDisabled"]);

  // TODO: impl react-aria `useCalendarCell`.

  return <Dynamic component={local.as} {...others} />;
});
