/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-types/calendar/src/index.d.ts
 */

import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date";

export type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;
export type TimeValue = Time | CalendarDateTime | ZonedDateTime;

export type DateAlignment = "start" | "center" | "end";

export type CalendarSelectionMode = "single" | "multiple" | "range";
