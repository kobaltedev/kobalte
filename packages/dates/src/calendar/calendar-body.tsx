import { Polymorphic } from "@kobalte/core";
import { ComponentProps } from "solid-js";

export type CalendarBodyProps = ComponentProps<"div">;

/**
 * Contains the calendar grids.
 */
export function CalendarBody(props: CalendarBodyProps) {
  return <Polymorphic as="div" {...props} />;
}
