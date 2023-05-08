import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";

export type CalendarBodyProps = ComponentProps<"div">;

/**
 * Contains the calendar grids.
 */
export function CalendarBody(props: CalendarBodyProps) {
  return <Polymorphic as="div" {...props} />;
}
