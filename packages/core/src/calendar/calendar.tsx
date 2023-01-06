import { createPolymorphicComponent } from "@kobalte/utils";

import { CalendarCell } from "./calendar-cell";
import { CalendarCellButton } from "./calendar-cell-button";
import { CalendarGrid } from "./calendar-grid";
import { CalendarNextPageButton } from "./calendar-next-page-button";
import { CalendarPrevPageButton } from "./calendar-prev-page-button";
import { CalendarSingle, CalendarSingleOptions } from "./calendar-single";
import { CalendarNextYearButton } from "./calendar-next-year-button";
import { CalendarPrevYearButton } from "./calendar-prev-year-button";

type CalendarComposite = {
  PrevPageButton: typeof CalendarPrevPageButton;
  NextPageButton: typeof CalendarNextPageButton;
  PrevYearButton: typeof CalendarPrevYearButton;
  NextYearButton: typeof CalendarNextYearButton;
  Grid: typeof CalendarGrid;
  Cell: typeof CalendarCell;
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

Calendar.PrevPageButton = CalendarPrevPageButton;
Calendar.NextPageButton = CalendarNextPageButton;
Calendar.PrevYearButton = CalendarPrevYearButton;
Calendar.NextYearButton = CalendarNextYearButton;
Calendar.Grid = CalendarGrid;
Calendar.Cell = CalendarCell;
Calendar.CellButton = CalendarCellButton;
