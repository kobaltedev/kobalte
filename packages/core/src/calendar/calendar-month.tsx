import { DateDuration, endOfMonth } from "@internationalized/date";
import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";
import { CalendarMonthContext, CalendarMonthContextValue } from "./calendar-month-context";

export interface CalendarMonthProps {
  /** The number of months to offset from the start date. */
  offset?: number;
}

/**
 * Root container for a month within a calendar or range calendar.
 */
export const CalendarMonth = createPolymorphicComponent<"div", CalendarMonthProps>(props => {
  const calendarContext = useCalendarContext();

  props = mergeDefaultProps({ as: "div" }, props);

  const [local, others] = splitProps(props, ["as", "offset"]);

  const startDate = createMemo(() => {
    const offset: DateDuration = local.offset != null ? { months: local.offset } : {};
    return calendarContext.state().visibleRange().start.add(offset);
  });

  const endDate = createMemo(() => {
    return endOfMonth(startDate());
  });

  const context: CalendarMonthContextValue = {
    startDate,
    endDate,
  };

  return (
    <CalendarMonthContext.Provider value={context}>
      <Dynamic component={local.as} {...others} />
    </CalendarMonthContext.Provider>
  );
});
