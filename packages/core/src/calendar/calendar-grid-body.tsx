import { getWeeksInMonth } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, createMemo, Index, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";
import { useCalendarMonthContext } from "./calendar-month-context";

export interface CalendarGridBodyOptions {
  /**
   * Render prop used to render each row of the calendar grid,
   * it receives a week index accessor as parameter.
   */
  children: (weekIndex: Accessor<number>) => JSX.Element;
}

/**
 * Contains the day cells of a `Calendar.Grid`.
 */
export const CalendarGridBody = createPolymorphicComponent<"tbody", CalendarGridBodyOptions>(
  props => {
    const calendarContext = useCalendarContext();
    const monthContext = useCalendarMonthContext();

    props = mergeDefaultProps({ as: "tbody" }, props);

    const [local, others] = splitProps(props, ["as", "children"]);

    const weekIndexes = () => {
      const weeksInMonth = getWeeksInMonth(
        monthContext.startDate(),
        calendarContext.state().locale()
      );

      return [...new Array(weeksInMonth).keys()];
    };

    return (
      <Dynamic component={local.as} {...others}>
        <Index each={weekIndexes()}>{local.children}</Index>
      </Dynamic>
    );
  }
);
