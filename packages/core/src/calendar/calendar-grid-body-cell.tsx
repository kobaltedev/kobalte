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
} from "../polymorphic/index.tsx";
import { useCalendarContext } from "./calendar-context.tsx";
import {
	CalendarGridBodyCellContext,
	type CalendarGridBodyCellContextValue,
} from "./calendar-grid-body-cell-context.tsx";
import type { DateValue } from "./types.ts";

export interface CalendarGridBodyCellOptions {
	/** The date that this cell represents. */
	date: DateValue;

	/**
	 * Whether the cell is disabled. By default, this is determined by the
	 * Calendar's `minValue`, `maxValue`, and `disabled` props.
	 */
	disabled?: boolean;
}

export interface CalendarGridBodyCellCommonProps<
	_T extends HTMLElement = HTMLElement,
> {}

export interface CalendarGridBodyCellRenderProps
	extends CalendarGridBodyCellCommonProps {
	role: "gridcell";
	"aria-disabled": "true" | undefined;
	"aria-selected": "true" | undefined;
	"aria-invalid": "true" | undefined;
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

	const others = omit(props as CalendarGridBodyCellProps, "date", "disabled");

	const isSelected = createMemo(() => {
		return rootContext.isCellSelected(props.date);
	});

	const isFocused = createMemo(() => {
		return rootContext.isCellFocused(props.date);
	});

	const isDisabled = createMemo(() => {
		return props.disabled || rootContext.isCellDisabled(props.date);
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
				aria-disabled={!isSelectable() ? "true" : undefined}
				aria-selected={isSelected() ? "true" : undefined}
				aria-invalid={isInvalid() ? "true" : undefined}
				aria-current={isDateToday() ? "date" : undefined}
				data-value={props.date.toString()}
				{...others}
			/>
		</CalendarGridBodyCellContext>
	);
}
