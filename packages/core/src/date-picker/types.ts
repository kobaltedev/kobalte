/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/950d45db36e63851f411ed0dc6a5aad0af57da68/packages/@react-types/datepicker/src/index.d.ts
 */

export type DateFieldGranularity = "day" | "hour" | "minute" | "second";
export type DateTimeFormatOptions = Pick<
  Intl.DateTimeFormatOptions,
  "year" | "month" | "day" | "hour" | "minute" | "second"
>;
