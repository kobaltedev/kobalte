import { createPolymorphicComponent } from "@kobalte/utils";

import { CalendarCell } from "./calendar-cell";
import { CalendarCellButton } from "./calendar-cell-button";
import { CalendarGrid } from "./calendar-grid";
import { CalendarNextButton } from "./calendar-next-button";
import { CalendarPrevButton } from "./calendar-prev-button";
import { CalendarSingle, CalendarSingleOptions } from "./calendar-single";

type CalendarComposite = {
  PrevButton: typeof CalendarPrevButton;
  NextButton: typeof CalendarNextButton;
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

Calendar.PrevButton = CalendarPrevButton;
Calendar.NextButton = CalendarNextButton;
Calendar.Grid = CalendarGrid;
Calendar.Cell = CalendarCell;
Calendar.CellButton = CalendarCellButton;
