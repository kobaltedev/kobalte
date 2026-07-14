import { useCalendarContext as useContext } from "./calendar-context.tsx";
import {
	CalendarBody as Body,
	type CalendarBodyProps,
} from "./calendar-body.tsx";
import {
	CalendarGrid as Grid,
	type CalendarGridOptions,
	type CalendarGridProps,
} from "./calendar-grid.tsx";
import {
	CalendarGridBody as GridBody,
	type CalendarGridBodyProps,
} from "./calendar-grid-body.tsx";
import {
	CalendarGridBodyCell as GridBodyCell,
	type CalendarGridBodyCellProps,
} from "./calendar-grid-body-cell.tsx";
import {
	CalendarGridBodyCellTrigger as GridBodyCellTrigger,
	type CalendarGridBodyCellTriggerProps,
} from "./calendar-grid-body-cell-trigger.tsx";
import {
	CalendarGridBodyRow as GridBodyRow,
	type CalendarGridBodyRowProps,
} from "./calendar-grid-body-row.tsx";
import {
	CalendarGridHeader as GridHeader,
	type CalendarGridHeaderProps,
} from "./calendar-grid-header.tsx";
import {
	CalendarGridHeaderCell as GridHeaderCell,
	type CalendarGridHeaderCellProps,
} from "./calendar-grid-header-cell.tsx";
import {
	CalendarGridHeaderRow as GridHeaderRow,
	type CalendarGridHeaderRowProps,
} from "./calendar-grid-header-row.tsx";
import {
	CalendarHeader as Header,
	type CalendarHeaderProps,
} from "./calendar-header.tsx";
import {
	CalendarHeading as Heading,
	type CalendarHeadingProps,
} from "./calendar-heading.tsx";
import {
	CalendarNextTrigger as NextTrigger,
	type CalendarNextTriggerOptions,
	type CalendarNextTriggerProps,
} from "./calendar-next-trigger.tsx";
import {
	CalendarPrevTrigger as PrevTrigger,
	type CalendarPrevTriggerOptions,
	type CalendarPrevTriggerProps,
} from "./calendar-prev-trigger.tsx";
import {
	CalendarRoot as Root,
	type CalendarMultipleSelectionOptions,
	type CalendarRangeSelectionOptions,
	type CalendarRootOptions,
	type CalendarRootProps,
	type CalendarSingleSelectionOptions,
} from "./calendar-root.tsx";
import type { DateAlignment, DateValue } from "./types.ts";

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
