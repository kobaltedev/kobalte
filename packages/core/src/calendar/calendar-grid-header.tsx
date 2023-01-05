/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/bb9f65fc853474065a9de9ed6f5f471c16689237/packages/@react-aria/calendar/src/useCalendarGrid.ts
 */

import { createPolymorphicComponent, mergeDefaultProps } from "@kobalte/utils";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export const CalendarGridHeader = createPolymorphicComponent<"thead">(props => {
  props = mergeDefaultProps({ as: "thead" }, props);

  const [local, others] = splitProps(props, ["as"]);

  // Column headers are hidden to screen readers to make navigating with a touch screen reader easier.
  // The day names are already included in the label of each cell, so there's no need to announce them twice.
  return <Dynamic component={local.as} aria-hidden="true" {...others} />;
});
