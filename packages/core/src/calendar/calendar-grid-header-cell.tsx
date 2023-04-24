/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/react-aria-components/src/Calendar.tsx
 */

import { ComponentProps } from "solid-js";

import { Polymorphic } from "../polymorphic";

export type CalendarGridHeaderCellProps = ComponentProps<"th">;

/**
 * A calendar grid header cell displays a week day name at the top of a column within a calendar.
 */
export function CalendarGridHeaderCell(props: CalendarGridHeaderCellProps) {
  return <Polymorphic as="th" {...props} />;
}
