import { getWeeksInMonth } from "@internationalized/date";
import { OverrideComponentProps, Repeat } from "@kobalte/utils";
import { createMemo, JSX, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarGridBodyOptions {
  /** A function to render a `<Calendar.Row>` for a week. */
  children?: (weekIndex: number) => JSX.Element;
}

export type CalendarGridBodyProps = OverrideComponentProps<"tbody", CalendarGridBodyOptions>;

/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export function CalendarGridBody(props: CalendarGridBodyProps) {
  const rootContext = useCalendarContext();
  const context = useCalendarGridContext();

  const [local, others] = splitProps(props, ["children"]);

  const weeksInMonth = createMemo(() => {
    return getWeeksInMonth(context.startDate(), rootContext.locale());
  });

  return (
    <Polymorphic as="tbody" {...others}>
      {/* @ts-ignore */}
      <Repeat times={weeksInMonth()}>{weekIndex => local.children?.(weekIndex)}</Repeat>
    </Polymorphic>
  );
}
