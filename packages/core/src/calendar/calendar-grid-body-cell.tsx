/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a8903d3b8c462b85cc34e8565e1a1084827d0a29/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { isToday } from "@internationalized/date";
import type { ValidComponent } from "@solidjs/web";
import { createMemo, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
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

export interface CalendarGridBodyCellCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

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
> = CalendarGridBodyCellOptions &
	Partial<CalendarGridBodyCellCommonProps<ElementOf<T>>>;

/**
 * A calendar grid body cell displays a date cell within a calendar grid which can be selected by the user.
 */
export function CalendarGridBodyCell<T extends ValidComponent = "td">(
	props: PolymorphicProps<T, CalendarGridBodyCellProps<T>>,
) {
	const rootContext = useCalendarContext();
	const others = omit(
		props as CalendarGridBodyCellProps,
		"date",
		"disabled",
	);

	const isSelected = createMemo(() => {
		return rootContext.isCellSelected(props.date);
	});

	const isFocused = createMemo(() => {
		return rootContext.isCellFocused(props.date);
	});

	const isDisabled = createMemo(() => {
		return (props as CalendarGridBodyCellProps).disabled ||
			rootContext.isCellDisabled(props.date);
	});

	const isUnavailable = createMemo(() => {
		return rootContext.isCellUnavailable(props.date);
	});

	const isSelectable = () => {
		return !rootContext.isReadOnly() && !isDisabled() && !isUnavailable();
	};

	const isInvalid = createMemo(() => {
		return rootContext.validationState() === "invalid" && isSelected();
	});

	const isDateToday = () => isToday(props.date, rootContext.timeZone());

	const context: CalendarGridBodyCellContextValue = {
		date: () => props.date,
		isSelected,
		isFocused,
		isUnavailable,
		isSelectable,
		isDisabled,
		isInvalid,
		isDateToday,
	};

	return (
		<CalendarGridBodyCellContext value={context}>
			<Polymorphic<CalendarGridBodyCellRenderProps>
				as="td"
				role="gridcell"
				aria-disabled={!isSelectable() || undefined}
				aria-selected={isSelected() || undefined}
				aria-invalid={isInvalid() || undefined}
				aria-current={isDateToday() ? "date" : undefined}
				data-value={props.date.toString()}
				{...others}
			/>
		</CalendarGridBodyCellContext>
	);
}
