/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 */

import {
	type DateDuration,
	endOfMonth,
	startOfWeek,
	today,
} from "@internationalized/date";
import { callHandler, mergeDefaultProps } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createMemo, omit } from "solid-js";

import { createDateFormatter } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import {
	CalendarGridContext,
	type CalendarGridContextValue,
} from "./calendar-grid-context";
import { getVisibleRangeDescription } from "./utils";

export interface CalendarGridOptions {
	/**
	 * An offset from the beginning of the visible date range that this grid should display.
	 * Useful when displaying more than one month at a time.
	 */
	offset?: DateDuration;

	/**
	 * The format of weekday names to display in the `Calendar.GridHeader`
	 * e.g. single letter, abbreviation, or full day name.
	 */
	weekDayFormat?: "narrow" | "short" | "long";
}

export interface CalendarGridCommonProps<T extends HTMLElement = HTMLTableElement> {
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string | undefined;
}

export interface CalendarGridRenderProps extends CalendarGridCommonProps {
	role: "grid";
	"aria-readonly": boolean | undefined;
	"aria-disabled": boolean | undefined;
	"aria-multiselectable": boolean;
}

export type CalendarGridProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridOptions & Partial<CalendarGridCommonProps<ElementOf<T>>>;

/**
 * A calendar grid displays a single grid of days within a calendar or range calendar which
 * can be keyboard navigated and selected by the user.
 */
export function CalendarGrid<T extends ValidComponent = "table">(
	props: PolymorphicProps<T, CalendarGridProps<T>>,
) {
	const rootContext = useCalendarContext();

	const mergedProps = mergeDefaultProps(
		{ weekDayFormat: "short" as const },
		props as CalendarGridProps,
	);

	const others = omit(
		mergedProps,
		"offset",
		"weekDayFormat",
		"onKeyDown",
		"onFocusIn",
		"onFocusOut",
		"aria-label",
	);

	const startDate = createMemo(() => {
		if (mergedProps.offset) {
			return rootContext.startDate().add(mergedProps.offset);
		}

		return rootContext.startDate();
	});

	const endDate = createMemo(() => endOfMonth(startDate()));

	const dayFormatter = createDateFormatter(() => ({
		weekday: mergedProps.weekDayFormat,
		timeZone: rootContext.timeZone(),
	}));

	const weekDays = createMemo(() => {
		const firstDayOfWeek = startOfWeek(
			today(rootContext.timeZone()),
			rootContext.locale(),
		);

		return [...new Array(7).keys()].map((index) => {
			const date = firstDayOfWeek.add({ days: index });
			return dayFormatter().format(date.toDate(rootContext.timeZone()));
		});
	});

	const visibleRangeDescription = createMemo(() => {
		return getVisibleRangeDescription(
			rootContext.translations(),
			startDate(),
			endDate(),
			rootContext.timeZone(),
			true,
		);
	});

	const ariaLabel = () => {
		return [mergedProps["aria-label"], visibleRangeDescription()]
			.filter(Boolean)
			.join(", ");
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLTableElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, mergedProps.onKeyDown as JSX.EventHandlerUnion<HTMLTableElement, KeyboardEvent> | undefined);

		switch (e.key) {
			case "Enter":
			case " ":
				e.preventDefault();
				rootContext.selectFocusedDate();
				break;
			case "PageUp":
				e.preventDefault();
				e.stopPropagation();
				rootContext.focusPreviousSection(e.shiftKey);
				break;
			case "PageDown":
				e.preventDefault();
				e.stopPropagation();
				rootContext.focusNextSection(e.shiftKey);
				break;
			case "End":
				e.preventDefault();
				e.stopPropagation();
				rootContext.focusSectionEnd();
				break;
			case "Home":
				e.preventDefault();
				e.stopPropagation();
				rootContext.focusSectionStart();
				break;
			case "ArrowLeft":
				e.preventDefault();
				e.stopPropagation();
				if (rootContext.direction() === "rtl") {
					rootContext.focusNextDay();
				} else {
					rootContext.focusPreviousDay();
				}
				break;
			case "ArrowUp":
				e.preventDefault();
				e.stopPropagation();
				rootContext.focusPreviousRow();
				break;
			case "ArrowRight":
				e.preventDefault();
				e.stopPropagation();
				if (rootContext.direction() === "rtl") {
					rootContext.focusPreviousDay();
				} else {
					rootContext.focusNextDay();
				}
				break;
			case "ArrowDown":
				e.preventDefault();
				e.stopPropagation();
				rootContext.focusNextRow();
				break;
			case "Escape":
				if (rootContext.selectionMode() === "range") {
					e.preventDefault();
					rootContext.setAnchorDate(undefined);
				}
				break;
		}
	};

	const onFocusIn: JSX.FocusEventHandlerUnion<HTMLTableElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, mergedProps.onFocusIn as JSX.FocusEventHandlerUnion<HTMLTableElement, FocusEvent> | undefined);

		rootContext.setIsFocused(true);
	};

	const onFocusOut: JSX.FocusEventHandlerUnion<HTMLTableElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, mergedProps.onFocusOut as JSX.FocusEventHandlerUnion<HTMLTableElement, FocusEvent> | undefined);

		rootContext.setIsFocused(false);
	};

	const context: CalendarGridContextValue = {
		startDate,
		weekDays,
	};

	return (
		<CalendarGridContext value={context}>
			<Polymorphic<CalendarGridRenderProps>
				as="table"
				role="grid"
				aria-readonly={rootContext.isReadOnly() || undefined}
				aria-disabled={rootContext.isDisabled() || undefined}
				aria-multiselectable={rootContext.selectionMode() !== "single"}
				aria-label={ariaLabel()}
				onKeyDown={onKeyDown}
				onFocusIn={onFocusIn}
				onFocusOut={onFocusOut}
				{...others}
			/>
		</CalendarGridContext>
	);
}
