import { getWeeksInMonth } from "@internationalized/date";
import { OverrideComponentProps } from "@kobalte/utils";
import { Accessor, createMemo, Index, JSX, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarGridBodyOptions {
  /**
   * Render prop used to render each row of the calendar grid,
   * it receives a week index accessor as parameter.
   */
  children: (weekIndex: Accessor<number>) => JSX.Element;
}

export type CalendarGridBodyProps = OverrideComponentProps<"tbody", CalendarGridBodyOptions>;

/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export function CalendarGridBody(props: CalendarGridBodyProps) {
  const rootContext = useCalendarContext();
  const context = useCalendarGridContext();

  const [local, others] = splitProps(props, ["children"]);

  const weekIndexes = createMemo(() => {
    const weeksInMonth = getWeeksInMonth(context.startDate(), rootContext.locale());

    return [...new Array(weeksInMonth).keys()];
  });

  return (
    <Polymorphic as="tbody" {...others}>
      <Index each={weekIndexes()}>{local.children}</Index>
    </Polymorphic>
  );
}
