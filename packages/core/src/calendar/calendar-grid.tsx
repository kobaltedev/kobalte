/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 */

import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createMemo, merge, omit } from "solid-js";

import { createDateFormatter } from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useCalendarContext } from "./calendar-context.tsx";
import {
	CalendarGridContext,
	type CalendarGridContextValue,
} from "./calendar-grid-context.tsx";
import {
	addDuration,
	type DateDuration,
	endOfMonth,
	startOfWeek,
	todayDate,
} from "./date-math.ts";
import { getVisibleRangeDescription } from "./utils.ts";

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

export interface CalendarGridCommonProps<T extends HTMLElement = HTMLElement> {
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocusIn: JSX.FocusEventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.FocusEventHandlerUnion<T, FocusEvent>;
	"aria-label"?: string;
}

export interface CalendarGridRenderProps extends CalendarGridCommonProps {
	role: "grid";
	"aria-readonly": "true" | undefined;
	"aria-disabled": "true" | undefined;
	"aria-multiselectable": "true" | "false";
	"aria-label": string | undefined;
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

	const mergedProps = merge(
		{ weekDayFormat: "short" } as const,
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
			return addDuration(rootContext.startDate(), mergedProps.offset);
		}

		return rootContext.startDate();
	});

	const endDate = createMemo(() => endOfMonth(startDate()));

	const dayFormatter = createDateFormatter(() => ({
		weekday: mergedProps.weekDayFormat,
	}));

	const weekDays = createMemo(() => {
		const firstDayOfWeek = startOfWeek(todayDate(), rootContext.locale());

		return [...new Array(7).keys()].map((index) => {
			const date = addDuration(firstDayOfWeek, { days: index });
			return dayFormatter().format(date);
		});
	});

	const visibleRangeDescription = createMemo(() => {
		return getVisibleRangeDescription(
			rootContext.locale(),
			rootContext.translations(),
			startDate(),
			endDate(),
			true,
		);
	});

	const ariaLabel = createMemo(() => {
		return (
			[mergedProps["aria-label"], visibleRangeDescription()]
				.filter(Boolean)
				.join(", ") || undefined
		);
	});

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, mergedProps.onKeyDown);

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

	const onFocusIn: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, mergedProps.onFocusIn);

		rootContext.setIsFocused(true);
	};

	const onFocusOut: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, mergedProps.onFocusOut);

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
				aria-readonly={rootContext.isReadOnly() ? "true" : undefined}
				aria-disabled={rootContext.isDisabled() ? "true" : undefined}
				aria-multiselectable={
					rootContext.selectionMode() !== "single" ? "true" : "false"
				}
				{...others}
				aria-label={ariaLabel()}
				onKeyDown={onKeyDown}
				onFocusIn={onFocusIn}
				onFocusOut={onFocusOut}
			/>
		</CalendarGridContext>
	);
}
