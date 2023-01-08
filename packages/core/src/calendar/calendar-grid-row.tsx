import { CalendarDate } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, Index, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarGridRowOptions {
  weekIndex: number;

  children: (date: Accessor<CalendarDate | null>) => JSX.Element;
}

export const CalendarGridRow = createPolymorphicComponent<"tr", CalendarGridRowOptions>(props => {
  const calendarContext = useCalendarContext();
  const context = useCalendarGridContext();

  props = mergeDefaultProps({ as: "tr" }, props);

  const [local, others] = splitProps(props, ["as", "children", "weekIndex"]);

  const datesInWeek = () => {
    return calendarContext.state().getDatesInWeek(local.weekIndex, context.startDate());
  };

  return (
    <Dynamic component={local.as} {...others}>
      <Index each={datesInWeek()}>{local.children}</Index>
    </Dynamic>
  );
});
