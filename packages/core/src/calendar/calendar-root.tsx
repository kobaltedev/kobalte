/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 *
 * Range selection follows corvu's simpler click-only model (no pointer-drag
 * tracking) — see `calendar-grid-body-cell-trigger.tsx` for the corvu credit.
 */

import type { RangeValue, ValidationState } from "@kobalte/utils";
import { createInteractOutside } from "@solid-primitives/interaction";
import type { ValidComponent } from "@solidjs/web";
import {
	type Accessor,
	createMemo,
	createSignal,
	merge,
	omit,
	type Ref,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	CALENDAR_INTL_MESSAGES,
	type CalendarIntlTranslations,
} from "./calendar.intl.ts";
import {
	CalendarContext,
	type CalendarContextValue,
	type CalendarDataSet,
} from "./calendar-context.tsx";
import { createCalendarState } from "./create-calendar-state.ts";
import type { DateDuration } from "./date-math.ts";
import type { DateAlignment, DateValue } from "./types.ts";
import { getVisibleRangeDescription } from "./utils.ts";

export interface CalendarSingleSelectionOptions {
	/** The selection mode of the calendar. */
	selectionMode: "single";

	/** The controlled selected date of the calendar. */
	value?: DateValue | null;

	/**
	 * The date of the calendar that should be selected when initially rendered.
	 * Useful when you do not need to control the state of the calendar.
	 */
	defaultValue?: DateValue | null;

	/** Event handler called when the selected date change. */
	onChange?: (value: DateValue) => void;
}

export interface CalendarMultipleSelectionOptions {
	/** The selection mode of the calendar. */
	selectionMode: "multiple";

	/** The controlled selected dates of the calendar. */
	value?: DateValue[] | null;

	/**
	 * The dates of the calendar that should be selected when initially rendered.
	 * Useful when you do not need to control the state of the calendar.
	 */
	defaultValue?: DateValue[] | null;

	/** Event handler called when the selected dates change. */
	onChange?: (value: DateValue[]) => void;
}

export interface CalendarRangeSelectionOptions {
	/** The selection mode of the calendar. */
	selectionMode: "range";

	/** The controlled selected date range of the calendar. */
	value?: RangeValue<DateValue> | null;

	/**
	 * The date range of the calendar that should be selected when initially rendered.
	 * Useful when you do not need to control the state of the calendar.
	 */
	defaultValue?: RangeValue<DateValue> | null;

	/** Event handler called when the selected date range change. */
	onChange?: (value: RangeValue<DateValue>) => void;
}

export type CalendarRootOptions = (
	| CalendarSingleSelectionOptions
	| CalendarMultipleSelectionOptions
	| CalendarRangeSelectionOptions
) & {
	/** The localized strings of the component. */
	translations?: CalendarIntlTranslations;

	/** The locale to display and edit the value according to. */
	locale?: string;

	/**
	 * The amount of days that will be displayed at once.
	 * This affects how pagination works.
	 */
	visibleDuration?: DateDuration;

	/** Determines how to align the initial selection relative to the visible date range. */
	selectionAlignment?: DateAlignment;

	/** The minimum allowed date that a user may select. */
	minValue?: DateValue;

	/** The maximum allowed date that a user may select. */
	maxValue?: DateValue;

	/**
	 * Callback that is called for each date of the calendar.
	 * If it returns true, then the date is unavailable.
	 */
	isDateUnavailable?: (date: DateValue) => boolean;

	/**
	 * In "range" selection mode, when combined with `isDateUnavailable`,
	 * determines whether non-contiguous ranges, i.e. ranges containing unavailable dates, may be selected.
	 */
	allowsNonContiguousRanges?: boolean;

	/** Whether to automatically focus the calendar when it mounts. */
	autoFocus?: boolean;

	/** Controls the currently focused date within the calendar. */
	focusedValue?: DateValue;

	/** The date that is focused when the calendar first mounts. */
	defaultFocusedValue?: DateValue;

	/** Handler that is called when the focused date changes. */
	onFocusChange?: (date: DateValue) => void;

	/** Whether the current selection is valid or invalid according to application logic. */
	validationState?: ValidationState;

	/** Whether the calendar is disabled. */
	disabled?: boolean;

	/** Whether the calendar value is read only. */
	readOnly?: boolean;
};

export interface CalendarRootCommonProps<T extends HTMLElement = HTMLElement> {
	ref: Ref<T>;
	"aria-label"?: string;
}

export interface CalendarRootRenderProps
	extends CalendarRootCommonProps,
		CalendarDataSet {
	role: "group";
	"aria-label": string | undefined;
}

export type CalendarRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarRootOptions & Partial<CalendarRootCommonProps<ElementOf<T>>>;

/**
 * A calendar displays one or more date grids and allows users to select a single, multiple or range of dates.
 */
export function CalendarRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CalendarRootProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement>();

	const mergedProps = merge(
		{
			visibleDuration: { months: 1 },
			selectionMode: "single",
			translations: CALENDAR_INTL_MESSAGES,
		} as const,
		props as CalendarRootProps,
	);

	const others = omit(
		mergedProps,
		"ref",
		"translations",
		"locale",
		"visibleDuration",
		"selectionAlignment",
		"selectionMode",
		"value",
		"defaultValue",
		"onChange",
		"minValue",
		"maxValue",
		"isDateUnavailable",
		"allowsNonContiguousRanges",
		"autoFocus",
		"focusedValue",
		"defaultFocusedValue",
		"onFocusChange",
		"validationState",
		"disabled",
		"readOnly",
		"aria-label",
	);

	const state = createCalendarState(mergedProps);

	const visibleRangeDescription = createMemo(() => {
		return getVisibleRangeDescription(
			state.locale(),
			state.translations(),
			state.startDate(),
			state.endDate(),
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

	createInteractOutside(
		{
			onInteractOutside: () => {
				// Stop range selection on interaction outside the calendar, e.g. tabbing away from the calendar.
				if (state.selectionMode() === "range" && state.anchorDate()) {
					state.selectFocusedDate();
				}
			},
		},
		ref,
	);

	const dataset: Accessor<CalendarDataSet> = createMemo(() => ({
		"data-disabled": state.isDisabled() ? "" : undefined,
		"data-readonly": state.isReadOnly() ? "" : undefined,
	}));

	const context: CalendarContextValue = {
		dataset,
		...state,
	};

	return (
		<CalendarContext value={context}>
			<Polymorphic<CalendarRootRenderProps>
				as="div"
				ref={[setRef, mergedProps.ref]}
				role="group"
				{...dataset()}
				{...others}
				aria-label={ariaLabel()}
			/>
		</CalendarContext>
	);
}
