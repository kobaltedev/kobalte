import { OverrideComponentProps } from "@kobalte/utils";
import { ComponentProps, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { DateValue } from "./types";
import { getEraFormat } from "./utils";
import { useCalendarContext } from "./calendar-context";
import { createDateFormatter } from "../i18n";
import { root } from "solid-js/web/types/core";
import { isSameDay } from "@internationalized/date";

export interface CalendarCellOptions {
  /** The date that this cell represents. */
  date: DateValue;

  /**
   * Whether the cell is disabled. By default, this is determined by the
   * Calendar's `minValue`, `maxValue`, and `isDisabled` props.
   */
  disabled?: boolean;
}

export type CalendarCellProps = OverrideComponentProps<"td", CalendarCellOptions>;

/**
 * A calendar cell displays a date cell within a calendar grid which can be selected by the user.
 */
export function CalendarCell(props: CalendarCellProps) {
  const rootContext = useCalendarContext();

  const [local, others] = splitProps(props, ["date", "disabled"]);

  const dateFormatter = createDateFormatter(() => ({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    era: getEraFormat(local.date),
    timeZone: rootContext.timeZone(),
  }));

  const isSelected = () => rootContext.isCellSelected(local.date);

  const isFocused = () => rootContext.isCellFocused(local.date);

  const isDisabled = () => local.disabled || rootContext.isCellDisabled(local.date);

  const isUnavailable = () => rootContext.isCellUnavailable(local.date);

  const isSelectable = () => !isDisabled() && !isUnavailable();

  const isInvalid = () => {
    if (rootContext.validationState() !== "invalid") {
      return false;
    }

    /*
    // TODO: RangeCalendar
    if (rootContext.selectionMode() === "range") {
      return (
        !rootContext.anchorDate() &&
        rootContext.highlightedRange() &&
        local.date.compare(rootContext.highlightedRange().start) >= 0 &&
        local.date.compare(rootContext.highlightedRange().end) <= 0
      );
    }
    */

    const value = rootContext.value();

    return value && isSameDay(value, local.date);
  };

  return <Polymorphic as="td" {...others} />;
}
