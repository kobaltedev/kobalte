import { createPolymorphicComponent } from "@kobalte/utils";

import { CalendarCell } from "./calendar-cell";
import { CalendarCellButton } from "./calendar-cell-button";
import { CalendarGrid } from "./calendar-grid";
import { CalendarNextPageButton } from "./calendar-next-page-button";
import { CalendarPrevPageButton } from "./calendar-prev-page-button";
import { CalendarSingle, CalendarSingleOptions } from "./calendar-single";

type CalendarComposite = {
  NextPageButton: typeof CalendarNextPageButton;
  PrevPageButton: typeof CalendarPrevPageButton;
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

Calendar.NextPageButton = CalendarNextPageButton;
Calendar.PrevPageButton = CalendarPrevPageButton;
Calendar.Grid = CalendarGrid;
Calendar.Cell = CalendarCell;
Calendar.CellButton = CalendarCellButton;
