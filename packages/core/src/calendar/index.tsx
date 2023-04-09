import {
  CalendarCell as Cell,
  type CalendarCellOptions,
  type CalendarCellProps,
} from "./calendar-cell";
import {
  CalendarCellTrigger as CellTrigger,
  type CalendarCellTriggerProps,
} from "./calendar-cell-trigger";
import {
  CalendarGrid as Grid,
  type CalendarGridOptions,
  type CalendarGridProps,
} from "./calendar-grid";
import {
  CalendarGridBody as GridBody,
  type CalendarGridBodyOptions,
  type CalendarGridBodyProps,
} from "./calendar-grid-body";
import {
  CalendarGridHeader as GridHeader,
  type CalendarGridHeaderProps,
} from "./calendar-grid-header";
import {
  CalendarHeaderCell as HeaderCell,
  type CalendarHeaderCellProps,
} from "./calendar-header-cell";
import { CalendarHeaderRow as HeaderRow, type CalendarHeaderRowProps } from "./calendar-header-row";
import { CalendarHeading as Heading, type CalendarHeadingProps } from "./calendar-heading";
import {
  CalendarNextTrigger as NextTrigger,
  type CalendarNextTriggerOptions,
  type CalendarNextTriggerProps,
} from "./calendar-next-trigger";
import {
  CalendarPrevTrigger as PrevTrigger,
  type CalendarPrevTriggerOptions,
  type CalendarPrevTriggerProps,
} from "./calendar-prev-trigger";
import {
  CalendarRoot as Root,
  type CalendarRootOptions,
  type CalendarRootProps,
} from "./calendar-root";
import { CalendarRow as Row, type CalendarRowOptions, type CalendarRowProps } from "./calendar-row";

export type {
  CalendarCellOptions,
  CalendarCellProps,
  CalendarCellTriggerProps,
  CalendarGridBodyOptions,
  CalendarGridBodyProps,
  CalendarGridHeaderProps,
  CalendarGridOptions,
  CalendarGridProps,
  CalendarHeaderCellProps,
  CalendarHeaderRowProps,
  CalendarHeadingProps,
  CalendarNextTriggerOptions,
  CalendarNextTriggerProps,
  CalendarPrevTriggerOptions,
  CalendarPrevTriggerProps,
  CalendarRootOptions,
  CalendarRootProps,
  CalendarRowOptions,
  CalendarRowProps,
};

export {
  Cell,
  CellTrigger,
  Grid,
  GridBody,
  GridHeader,
  HeaderCell,
  HeaderRow,
  Heading,
  NextTrigger,
  PrevTrigger,
  Root,
  Row,
};

/*

<Calendar.Root>
  <Calendar.Header>
    <Calendar.PrevTrigger/>
    <Calendar.ViewTrigger/>
    <Calendar.NextTrigger/>
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHeader>
      <Calendar.HeaderRow>
        <Calendar.HeaderCell/>
      </Calendar.HeaderRow>
    </Calendar.GridHeader>
    <Calendar.GridBody>
      <Calendar.Row>
        <Calendar.Cell>
          <Calendar.CellTrigger/>
        </Calendar.Cell>
      </Calendar.Row>
    </Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>

*/
