import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";

export type CalendarHeaderProps = ComponentProps<"header">;

/**
 * Contains the calendar heading and navigation triggers.
 */
export function CalendarHeader(props: CalendarHeaderProps) {
  return <Polymorphic as="header" {...props} />;
}
