import { CalendarDate } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, Index, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";
import { useCalendarMonthContext } from "./calendar-month-context";

export interface CalendarRowOptions {
  weekIndex: number;

  children: (date: Accessor<CalendarDate | null>) => JSX.Element;
}

/**
 * Contains a row of day cells within a `Calendar.Grid`.
 */
export const CalendarRow = createPolymorphicComponent<"tr", CalendarRowOptions>(props => {
  const calendarContext = useCalendarContext();
  const monthContext = useCalendarMonthContext();

  props = mergeDefaultProps({ as: "tr" }, props);

  const [local, others] = splitProps(props, ["as", "children", "weekIndex"]);

  const datesInWeek = () => {
    return calendarContext.state().getDatesInWeek(local.weekIndex, monthContext.startDate());
  };

  return (
    <Dynamic component={local.as} {...others}>
      <Index each={datesInWeek()}>{local.children}</Index>
    </Dynamic>
  );
});
