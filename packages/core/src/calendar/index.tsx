import { useCalendarContext as useContext } from "./calendar-context";
import {
	CalendarBody as Body,
	type CalendarBodyProps,
} from "./calendar-body";
import {
	CalendarGrid as Grid,
	type CalendarGridOptions,
	type CalendarGridProps,
} from "./calendar-grid";
import {
	CalendarGridBody as GridBody,
	type CalendarGridBodyProps,
} from "./calendar-grid-body";
import {
	CalendarGridBodyCell as GridBodyCell,
	type CalendarGridBodyCellProps,
} from "./calendar-grid-body-cell";
import {
	CalendarGridBodyCellTrigger as GridBodyCellTrigger,
	type CalendarGridBodyCellTriggerProps,
} from "./calendar-grid-body-cell-trigger";
import {
	CalendarGridBodyRow as GridBodyRow,
	type CalendarGridBodyRowProps,
} from "./calendar-grid-body-row";
import {
	CalendarGridHeader as GridHeader,
	type CalendarGridHeaderProps,
} from "./calendar-grid-header";
import {
	CalendarGridHeaderCell as GridHeaderCell,
	type CalendarGridHeaderCellProps,
} from "./calendar-grid-header-cell";
import {
	CalendarGridHeaderRow as GridHeaderRow,
	type CalendarGridHeaderRowProps,
} from "./calendar-grid-header-row";
import {
	CalendarHeader as Header,
	type CalendarHeaderProps,
} from "./calendar-header";
import {
	CalendarHeading as Heading,
	type CalendarHeadingProps,
} from "./calendar-heading";
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
	type CalendarMultipleSelectionOptions,
	type CalendarRangeSelectionOptions,
	type CalendarRootOptions,
	type CalendarRootProps,
	type CalendarSingleSelectionOptions,
} from "./calendar-root";
import type { DateAlignment, DateValue } from "./types";

export type {
	CalendarBodyProps,
	CalendarGridBodyCellProps,
	CalendarGridBodyCellTriggerProps,
	CalendarGridBodyProps,
	CalendarGridBodyRowProps,
	CalendarGridHeaderCellProps,
	CalendarGridHeaderProps,
	CalendarGridHeaderRowProps,
	CalendarGridOptions,
	CalendarGridProps,
	CalendarHeaderProps,
	CalendarHeadingProps,
	CalendarMultipleSelectionOptions,
	CalendarNextTriggerOptions,
	CalendarNextTriggerProps,
	CalendarPrevTriggerOptions,
	CalendarPrevTriggerProps,
	CalendarRangeSelectionOptions,
	CalendarRootOptions,
	CalendarRootProps,
	CalendarSingleSelectionOptions,
	DateAlignment,
	DateValue,
};

export const Calendar = Object.assign(Root, {
	Body,
	Grid,
	GridBody,
	GridBodyCell,
	GridBodyCellTrigger,
	GridBodyRow,
	GridHeader,
	GridHeaderCell,
	GridHeaderRow,
	Header,
	Heading,
	NextTrigger,
	PrevTrigger,
	useContext,
});

export {
	Body,
	Grid,
	GridBody,
	GridBodyCell,
	GridBodyCellTrigger,
	GridBodyRow,
	GridHeader,
	GridHeaderCell,
	GridHeaderRow,
	Header,
	Heading,
	NextTrigger,
	PrevTrigger,
	Root,
};
