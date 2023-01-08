import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, Index, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarGridBodyOptions {
  children: (weekIndex: Accessor<number>) => JSX.Element;
}

export const CalendarGridBody = createPolymorphicComponent<"tbody", CalendarGridBodyOptions>(
  props => {
    const calendarContext = useCalendarContext();
    const context = useCalendarGridContext();

    props = mergeDefaultProps({ as: "tbody" }, props);

    const [local, others] = splitProps(props, ["as", "children"]);

    const weekIndexes = () => {
      return [...new Array(calendarContext.state().getWeeksInMonth(context.startDate())).keys()];
    };

    return (
      <Dynamic component={local.as} {...others}>
        <Index each={weekIndexes()}>{local.children}</Index>
      </Dynamic>
    );
  }
);
