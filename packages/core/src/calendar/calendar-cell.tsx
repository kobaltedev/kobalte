import { isSameDay, isToday } from "@internationalized/date";
import { OverrideComponentProps } from "@kobalte/utils";
import { createMemo, splitProps } from "solid-js";

import { Polymorphic } from "../polymorphic";
import { CalendarCellContext, CalendarCellContextValue } from "./calendar-cell-context";
import { useCalendarContext } from "./calendar-context";
import { DateValue } from "./types";

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

  const isSelected = createMemo(() => {
    return rootContext.isCellSelected(local.date);
  });

  const isFocused = createMemo(() => {
    return rootContext.isCellFocused(local.date);
  });

  const isDisabled = createMemo(() => {
    return local.disabled || rootContext.isCellDisabled(local.date);
  });

  const isUnavailable = createMemo(() => {
    return rootContext.isCellUnavailable(local.date);
  });

  const isSelectable = () => {
    return !rootContext.isReadOnly() && !isDisabled() && !isUnavailable();
  };

  const isInvalid = createMemo(() => {
    return rootContext.validationState() === "invalid" && isSelected();
  });

  const isDateToday = () => isToday(local.date, rootContext.timeZone());

  const context: CalendarCellContextValue = {
    date: () => local.date,
    isSelected,
    isFocused,
    isUnavailable,
    isSelectable,
    isDisabled,
    isInvalid,
    isDateToday,
  };

  return (
    <CalendarCellContext.Provider value={context}>
      <Polymorphic
        as="td"
        role="gridcell"
        aria-disabled={!isSelectable() || undefined}
        aria-selected={isSelected() || undefined}
        aria-invalid={isInvalid() || undefined}
        aria-current={isDateToday() ? "date" : undefined}
        data-value={local.date.toString()}
        {...others}
      />
    </CalendarCellContext.Provider>
  );
}
