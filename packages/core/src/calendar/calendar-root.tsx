import { createCalendar } from "@internationalized/date";
import { OverrideComponentProps } from "@kobalte/utils";

import { useLocale } from "../i18n";
import { CalendarBase, CalendarBaseOptions } from "./calendar-base";

export interface CalendarRootOptions extends Partial<CalendarBaseOptions> {}

export type CalendarRootProps = OverrideComponentProps<"div", CalendarRootOptions>;

/**
 * A calendar displays one or more date grids and allows users to select a single date.
 */
export function CalendarRoot(props: CalendarRootProps) {
  const { locale } = useLocale();

  return <CalendarBase locale={locale()} createCalendar={createCalendar} {...props} />;
}
