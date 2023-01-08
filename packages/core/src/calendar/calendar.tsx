import { createPolymorphicComponent } from "@kobalte/utils";

import { CalendarGridCell } from "./calendar-grid-cell";
import { CalendarCellButton } from "./calendar-cell-button";
import { CalendarGrid } from "./calendar-grid";
import { CalendarNextPageButton } from "./calendar-next-page-button";
import { CalendarPrevPageButton } from "./calendar-prev-page-button";
import { CalendarSingle, CalendarSingleOptions } from "./calendar-single";
import { CalendarGridBody } from "./calendar-grid-body";
import { CalendarGridRow } from "./calendar-grid-row";
import { CalendarGridHeader } from "./calendar-grid-header";
import { CalendarWeekDays } from "./calendar-week-days";

type CalendarComposite = {
  NextPageButton: typeof CalendarNextPageButton;
  PrevPageButton: typeof CalendarPrevPageButton;
  Grid: typeof CalendarGrid;
  GridHeader: typeof CalendarGridHeader;
  WeekDays: typeof CalendarWeekDays;
  GridBody: typeof CalendarGridBody;
  GridRow: typeof CalendarGridRow;
  GridCell: typeof CalendarGridCell;
  CellButton: typeof CalendarCellButton;
};

/**
 * Displays one or more date grids and allows users to select a single date.
 */
export const Calendar = createPolymorphicComponent<"div", CalendarSingleOptions, CalendarComposite>(
  props => {
    return <CalendarSingle {...props} />;
  }
);

Calendar.NextPageButton = CalendarNextPageButton;
Calendar.PrevPageButton = CalendarPrevPageButton;
Calendar.Grid = CalendarGrid;
Calendar.GridHeader = CalendarGridHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.GridBody = CalendarGridBody;
Calendar.GridRow = CalendarGridRow;
Calendar.GridCell = CalendarGridCell;
Calendar.CellButton = CalendarCellButton;
