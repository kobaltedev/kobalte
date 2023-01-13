import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Show, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";
import { createVisibleRangeDescription } from "./primitives";
import { useCalendarMonthContext } from "./calendar-month-context";

/**
 * A description of the visible `Calendar.Month`.
 */
export const CalendarTitle = createPolymorphicComponent<"h2">(props => {
  const calendarContext = useCalendarContext();
  const monthContext = useCalendarMonthContext();

  props = mergeDefaultProps({ as: "h2" }, props);

  const [local, others] = splitProps(props, ["as"]);

  const title = createVisibleRangeDescription({
    startDate: () => monthContext.startDate(),
    endDate: () => monthContext.endDate(),
    timeZone: () => calendarContext.state().timeZone(),
    isAria: () => false,
  });

  return <Dynamic component={local.as} children={title()} {...others} />;
});
