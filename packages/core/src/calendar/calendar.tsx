import { createPolymorphicComponent } from "@kobalte/utils";

import { CalendarCell } from "./calendar-cell";
import { CalendarDay } from "./calendar-day";
import { CalendarGrid } from "./calendar-grid";
import { CalendarNextPageButton } from "./calendar-next-page-button";
import { CalendarPrevPageButton } from "./calendar-prev-page-button";
import { CalendarSingle, CalendarSingleOptions } from "./calendar-single";
import { CalendarGridBody } from "./calendar-grid-body";
import { CalendarRow } from "./calendar-row";
import { CalendarGridHeader } from "./calendar-grid-header";
import { CalendarWeekDays } from "./calendar-week-days";
import { CalendarWeekDay } from "./calendar-week-day";
import { CalendarMonth } from "./calendar-month";
import { CalendarTitle } from "./calendar-title";
import { CalendarRange } from "./calendar-range";

type CalendarComposite = {
  Range: typeof CalendarRange;
  Month: typeof CalendarMonth;
  Header: typeof CalendarGridHeader;
  Title: typeof CalendarTitle;
  NextPageButton: typeof CalendarNextPageButton;
  PrevPageButton: typeof CalendarPrevPageButton;
  Grid: typeof CalendarGrid;
  GridHeader: typeof CalendarGridHeader;
  WeekDays: typeof CalendarWeekDays;
  WeekDay: typeof CalendarWeekDay;
  GridBody: typeof CalendarGridBody;
  Row: typeof CalendarRow;
  Cell: typeof CalendarCell;
  Day: typeof CalendarDay;
};

/**
 * Displays one or more date grids and allows users to select a single date.
 */
export const Calendar = createPolymorphicComponent<"div", CalendarSingleOptions, CalendarComposite>(
  props => {
    return <CalendarSingle {...props} />;
  }
);

Calendar.Range = CalendarRange;
Calendar.Month = CalendarMonth;
Calendar.Header = CalendarGridHeader;
Calendar.Title = CalendarTitle;
Calendar.NextPageButton = CalendarNextPageButton;
Calendar.PrevPageButton = CalendarPrevPageButton;
Calendar.Grid = CalendarGrid;
Calendar.GridHeader = CalendarGridHeader;
Calendar.WeekDays = CalendarWeekDays;
Calendar.WeekDay = CalendarWeekDay;
Calendar.GridBody = CalendarGridBody;
Calendar.Row = CalendarRow;
Calendar.Cell = CalendarCell;
Calendar.Day = CalendarDay;
