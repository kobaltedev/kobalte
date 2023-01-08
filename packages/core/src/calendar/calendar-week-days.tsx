import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { Accessor, Index, JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useCalendarContext } from "./calendar-context";

export interface CalendarWeekDaysOptions {
  children: (weekDay: Accessor<string>) => JSX.Element;
}

export const CalendarWeekDays = createPolymorphicComponent<"tr", CalendarWeekDaysOptions>(props => {
  const context = useCalendarContext();

  props = mergeDefaultProps({ as: "tr" }, props);

  const [local, others] = splitProps(props, ["as", "children"]);

  return (
    <Dynamic component={local.as} {...others}>
      <Index each={context.state().weekDays()}>{local.children}</Index>
    </Dynamic>
  );
});
