/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import { ComponentProps, createMemo } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { getVisibleRangeDescription } from "./utils";

export type CalendarHeadingProps = ComponentProps<"h2">;

export function CalendarHeading(props: CalendarHeadingProps) {
  const rootContext = useCalendarContext();

  const title = createMemo(() => {
    return getVisibleRangeDescription(
      rootContext.messageFormatter(),
      rootContext.startDate(),
      rootContext.endDate(),
      rootContext.timeZone(),
      false
    );
  });

  return (
    <Polymorphic as="h2" {...props}>
      {title()}
    </Polymorphic>
  );
}
