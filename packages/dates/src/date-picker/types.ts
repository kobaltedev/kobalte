/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-types/datepicker/src/index.d.ts
 */

export type DateFieldGranularity = "day" | "hour" | "minute" | "second";
export type DateFieldMaxGranularity = "year" | "month" | DateFieldGranularity;

export type DateFieldHourCycle = 12 | 24;

export type DateFieldOptions = Pick<
  Intl.DateTimeFormatOptions,
  "year" | "month" | "day" | "hour" | "minute" | "second"
>;

export type SegmentType =
  | "era"
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "dayPeriod"
  | "literal"
  | "timeZoneName";

export interface DateSegment {
  /** The type of segment. */
  type: SegmentType;

  /** The formatted text for the segment. */
  text: string;

  /** The numeric value for the segment, if applicable. */
  value?: number;

  /** The minimum numeric value for the segment, if applicable. */
  minValue?: number;

  /** The maximum numeric value for the segment, if applicable. */
  maxValue?: number;

  /** Whether the value is a placeholder. */
  isPlaceholder: boolean;

  /** A placeholder string for the segment. */
  placeholder: string;

  /** Whether the segment is editable. */
  isEditable: boolean;
}
