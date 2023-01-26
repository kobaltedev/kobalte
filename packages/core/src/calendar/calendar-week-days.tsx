import { startOfWeek, today } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createMemo, Index, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createDateFormatter } from "../i18n";
import { useCalendarContext } from "./calendar-context";

export interface CalendarWeekDaysOptions {
  /**
   * The representation of the weekday according to the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#syntax) API.
   * Possible values are:
   * - "long" (e.g., Thursday)
   * - "short" (e.g., Thu)
   * - "narrow" (e.g., T).
   */
  format?: Intl.DateTimeFormatOptions["weekday"];

  /**
   * Render prop used to render each weekday cell,
   * it receives a weekday accessor as parameter.
   */
  children: (weekDay: Accessor<string>) => JSX.Element;
}

/**
 * A row in the `Calendar.GridHeader`, used to contain the weekday cells.
 */
export const CalendarWeekDays = /*#__PURE__*/ createPolymorphicComponent<
  "tr",
  CalendarWeekDaysOptions
>(props => {
  const context = useCalendarContext();

  props = mergeDefaultProps(
    {
      as: "tr",
      format: "short",
    },
    props
  );

  const [local, others] = splitProps(props, ["as", "children", "format"]);

  const dayFormatter = createDateFormatter(() => ({
    weekday: local.format,
    timeZone: context.state().timeZone(),
  }));

  const weekDays = createMemo(() => {
    const weekStart = startOfWeek(today(context.state().timeZone()), context.state().locale());

    return [...new Array(7).keys()].map(index => {
      const date = weekStart.add({ days: index });
      const dateDay = date.toDate(context.state().timeZone());
      return dayFormatter().format(dateDay);
    });
  });

  return (
    <Dynamic component={local.as} {...others}>
      <Index each={weekDays()}>{local.children}</Index>
    </Dynamic>
  );
});
