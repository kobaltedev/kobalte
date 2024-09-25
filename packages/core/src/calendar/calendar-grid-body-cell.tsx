import { isToday } from "@internationalized/date";
import { createMemo, splitProps, ValidComponent } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import {
	CalendarGridBodyCellContext,
	type CalendarGridBodyCellContextValue,
} from "./calendar-grid-body-cell-context";
import type { DateValue } from "./types";

export interface CalendarGridBodyCellOptions {
	/** The date that this cell represents. */
	date: DateValue;

	/**
	 * Whether the cell is disabled. By default, this is determined by the
	 * Calendar's `minValue`, `maxValue`, and `isDisabled` props.
	 */
	disabled?: boolean;
}

export interface CalendarGridBodyCellCommonProps<T extends HTMLElement = HTMLElement> {
}

export interface CalendarGridBodyCellRenderProps
	extends CalendarGridBodyCellCommonProps {
		role: "gridcell";
		"aria-disabled": boolean | undefined;
		"aria-selected": boolean | undefined;
		"aria-invalid": boolean | undefined;
		"aria-current": "date" | undefined;
		"data-value": string;
}

export type CalendarGridBodyCellProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridBodyCellOptions & Partial<CalendarGridBodyCellCommonProps<ElementOf<T>>>;

/**
 * A calendar grid body cell displays a date cell within a calendar grid which can be selected by the user.
 */
export function CalendarGridBodyCell<T extends ValidComponent = "td">(
	props: PolymorphicProps<T, CalendarGridBodyCellProps<T>>,
) {
	const rootContext = useCalendarContext();

	const [local, others] = splitProps(props as CalendarGridBodyCellProps, ["date", "disabled"]);

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

	const context: CalendarGridBodyCellContextValue = {
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
		<CalendarGridBodyCellContext.Provider value={context}>
			<Polymorphic<CalendarGridBodyCellRenderProps>
				as="td"
				role="gridcell"
				aria-disabled={!isSelectable() || undefined}
				aria-selected={isSelected() || undefined}
				aria-invalid={isInvalid() || undefined}
				aria-current={isDateToday() ? "date" : undefined}
				data-value={local.date.toString()}
				{...others}
			/>
		</CalendarGridBodyCellContext.Provider>
	);
}
