import {
	CalendarBody as Body,
	type CalendarBodyOptions,
	type CalendarBodyProps,
} from "./calendar-body.tsx";
import {
	type CalendarGridOptions,
	type CalendarGridProps,
	CalendarGrid as Grid,
} from "./calendar-grid.tsx";
import {
	type CalendarGridBodyOptions,
	type CalendarGridBodyProps,
	CalendarGridBody as GridBody,
} from "./calendar-grid-body.tsx";
import {
	type CalendarGridBodyCellOptions,
	type CalendarGridBodyCellProps,
	CalendarGridBodyCell as GridBodyCell,
} from "./calendar-grid-body-cell.tsx";
import {
	type CalendarGridBodyCellTriggerOptions,
	type CalendarGridBodyCellTriggerProps,
	CalendarGridBodyCellTrigger as GridBodyCellTrigger,
} from "./calendar-grid-body-cell-trigger.tsx";
import {
	type CalendarGridBodyRowOptions,
	type CalendarGridBodyRowProps,
	CalendarGridBodyRow as GridBodyRow,
} from "./calendar-grid-body-row.tsx";
import {
	type CalendarGridHeaderOptions,
	type CalendarGridHeaderProps,
	CalendarGridHeader as GridHeader,
} from "./calendar-grid-header.tsx";
import {
	type CalendarGridHeaderCellOptions,
	type CalendarGridHeaderCellProps,
	CalendarGridHeaderCell as GridHeaderCell,
} from "./calendar-grid-header-cell.tsx";
import {
	type CalendarGridHeaderRowOptions,
	type CalendarGridHeaderRowProps,
	CalendarGridHeaderRow as GridHeaderRow,
} from "./calendar-grid-header-row.tsx";
import {
	type CalendarHeaderOptions,
	type CalendarHeaderProps,
	CalendarHeader as Header,
} from "./calendar-header.tsx";
import {
	type CalendarHeadingOptions,
	type CalendarHeadingProps,
	CalendarHeading as Heading,
} from "./calendar-heading.tsx";
import {
	type CalendarNextTriggerOptions,
	type CalendarNextTriggerProps,
	CalendarNextTrigger as NextTrigger,
} from "./calendar-next-trigger.tsx";
import {
	type CalendarPrevTriggerOptions,
	type CalendarPrevTriggerProps,
	CalendarPrevTrigger as PrevTrigger,
} from "./calendar-prev-trigger.tsx";
import {
	type CalendarMultipleSelectionOptions,
	type CalendarRangeSelectionOptions,
	type CalendarRootCommonProps,
	type CalendarRootOptions,
	type CalendarRootProps,
	type CalendarRootRenderProps,
	type CalendarSingleSelectionOptions,
	CalendarRoot as Root,
} from "./calendar-root.tsx";

export type { CalendarIntlTranslations } from "./calendar.intl.ts";
export type { CalendarState } from "./create-calendar-state.ts";
export type {
	CalendarSelectionMode,
	DateAlignment,
	DateValue,
} from "./types.ts";
export type {
	CalendarBodyOptions,
	CalendarBodyProps,
	CalendarGridBodyCellOptions,
	CalendarGridBodyCellProps,
	CalendarGridBodyCellTriggerOptions,
	CalendarGridBodyCellTriggerProps,
	CalendarGridBodyOptions,
	CalendarGridBodyProps,
	CalendarGridBodyRowOptions,
	CalendarGridBodyRowProps,
	CalendarGridHeaderCellOptions,
	CalendarGridHeaderCellProps,
	CalendarGridHeaderOptions,
	CalendarGridHeaderProps,
	CalendarGridHeaderRowOptions,
	CalendarGridHeaderRowProps,
	CalendarGridOptions,
	CalendarGridProps,
	CalendarHeaderOptions,
	CalendarHeaderProps,
	CalendarHeadingOptions,
	CalendarHeadingProps,
	CalendarMultipleSelectionOptions,
	CalendarNextTriggerOptions,
	CalendarNextTriggerProps,
	CalendarPrevTriggerOptions,
	CalendarPrevTriggerProps,
	CalendarRangeSelectionOptions,
	CalendarRootCommonProps,
	CalendarRootOptions,
	CalendarRootProps,
	CalendarRootRenderProps,
	CalendarSingleSelectionOptions,
};

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
});
