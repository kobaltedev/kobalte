/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import {
	type Calendar,
	type DateDuration,
	DateFormatter,
	GregorianCalendar,
	getDayOfWeek,
	isSameDay,
	maxDate,
	minDate,
	startOfWeek,
	toCalendar,
	toCalendarDate,
	today,
} from "@internationalized/date";
import {
	contains,
	getDocument,
	getWindow,
	mergeDefaultProps,
	mergeRefs,
	type RangeValue,
	type ValidationState,
} from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { isServer } from "@solidjs/web";
import {
	type Accessor,
	createEffect,
	createMemo,
	createSignal,
	omit,
} from "solid-js";

import { getReadingDirection, useLocale } from "../i18n";
import { announce } from "../live-announcer";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createInteractOutside } from "@solid-primitives/interaction";
import { createControllableSignal } from "../primitives";
import {
	CALENDAR_INTL_MESSAGES,
	type CalendarIntlTranslations,
} from "./calendar.intl";
import {
	CalendarContext,
	type CalendarContextValue,
	type CalendarDataSet,
} from "./calendar-context";
import type { CalendarSelectionMode, DateAlignment, DateValue } from "./types";
import {
	alignCenter,
	alignDate,
	asArrayValue,
	asRangeValue,
	asSingleValue,
	constrainValue,
	getAdjustedDateFn,
	getArrayValueOfSelection,
	getEndDate,
	getFirstValueOfSelection,
	getNextPage,
	getNextRow,
	getNextSection,
	getNextUnavailableDate,
	getPreviousAvailableDate,
	getPreviousPage,
	getPreviousRow,
	getPreviousSection,
	getSectionEnd,
	getSectionStart,
	getSelectedDateDescription,
	getSelectedDateRangeDescription,
	getVisibleRangeDescription,
	isDateInvalid,
	makeCalendarDateRange,
	sortDates,
} from "./utils";

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

		/**
		 * A function that creates a [Calendar](https://react-spectrum.adobe.com/internationalized/date/Calendar.html)
		 * object for a given calendar identifier. Such a function may be imported from the
		 * `@internationalized/date` package, or manually implemented to include support for
		 * only certain calendars.
		 */
		createCalendar: (name: string) => Calendar;

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
	ref: T | ((el: T) => void);
	"aria-label": string | undefined;
}

export interface CalendarRootRenderProps extends CalendarRootCommonProps {
	role: "group";
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
	let ref: HTMLElement | undefined;

	const merged = mergeDefaultProps(
		{
			visibleDuration: { months: 1 },
			selectionMode: "single" as CalendarSelectionMode,
			translations: CALENDAR_INTL_MESSAGES,
		},
		props as CalendarRootProps,
	);

	const others = omit(
		merged,
		"translations",
		"ref",
		"locale",
		"createCalendar",
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

	const locale = createMemo(() => {
		return merged.locale ?? useLocale().locale();
	});

	const resolvedOptions = createMemo(() => {
		return new DateFormatter(locale()).resolvedOptions();
	});

	const direction = createMemo(() => {
		return getReadingDirection(locale());
	});

	const calendar = createMemo(() => {
		return merged.createCalendar(resolvedOptions().calendar);
	});

	const [value, setControlledValue] = createControllableSignal<
		DateValue | DateValue[] | RangeValue<DateValue> | null | undefined
	>({
		value: () => merged.value,
		defaultValue: () => merged.defaultValue,
		onChange: (value) => (merged.onChange as ((v: typeof value) => void) | undefined)?.(value),
	});

	const [availableRange, setAvailableRange] =
		createSignal<RangeValue<DateValue | undefined>>();

	const selectionAlignment = createMemo(() => {
		if (merged.selectionMode === "range") {
			const valueRange = asRangeValue(value());

			if (valueRange?.start && valueRange.end) {
				const start = alignCenter(
					toCalendarDate(valueRange.start),
					merged.visibleDuration!,
					locale(),
					merged.minValue,
					merged.maxValue,
				);

				const end = start.add(merged.visibleDuration!).subtract({ days: 1 });

				if (valueRange.end.compare(end) > 0) {
					return "start";
				}
			}

			return "center";
		}

		return merged.selectionAlignment ?? "center";
	});

	const min = createMemo(() => {
		const startRange = availableRange()?.start;

		if (merged.selectionMode === "range" && merged.minValue && startRange) {
			return maxDate(merged.minValue, startRange);
		}

		return merged.minValue;
	});

	const max = createMemo(() => {
		const endRange = availableRange()?.end;

		if (merged.selectionMode === "range" && merged.maxValue && endRange) {
			return minDate(merged.maxValue, endRange);
		}

		return merged.maxValue;
	});

	const calendarDateValue = createMemo(() => {
		return getArrayValueOfSelection(merged.selectionMode, value()).map((date) =>
			toCalendar(toCalendarDate(date), calendar()),
		);
	});

	const timeZone = createMemo(() => {
		const firstValue = getFirstValueOfSelection(merged.selectionMode, value());

		if (firstValue && "timeZone" in firstValue) {
			return firstValue.timeZone;
		}

		return resolvedOptions().timeZone;
	});

	const focusedCalendarDate = createMemo(() => {
		if (merged.focusedValue) {
			return constrainValue(
				toCalendar(toCalendarDate(merged.focusedValue), calendar()),
				min(),
				max(),
			);
		}

		return undefined;
	});

	const defaultFocusedCalendarDate = createMemo(() => {
		return constrainValue(
			merged.defaultFocusedValue
				? toCalendar(toCalendarDate(merged.defaultFocusedValue), calendar())
				: calendarDateValue()[0] || toCalendar(today(timeZone()), calendar()),
			min(),
			max(),
		);
	});

	const [focusedDate, setFocusedDate] = createControllableSignal({
		value: focusedCalendarDate,
		defaultValue: defaultFocusedCalendarDate,
		onChange: (value) => merged.onFocusChange?.(value),
	});

	const [startDate, setStartDate] = createSignal(
		alignDate(
			focusedDate()!,
			selectionAlignment(),
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		),
	);

	const endDate = createMemo(() => {
		return getEndDate(startDate(), merged.visibleDuration!);
	});

	const [isFocused, setIsFocused] = createSignal(merged.autoFocus || false);

	const [isDragging, setIsDragging] = createSignal(false);

	const visibleRangeDescription = createMemo(() => {
		return getVisibleRangeDescription(
			merged.translations!,
			startDate(),
			endDate(),
			timeZone(),
			true,
		);
	});

	const ariaLabel = () => {
		return [merged["aria-label"], visibleRangeDescription()]
			.filter(Boolean)
			.join(", ");
	};

	const isCellDisabled = (date: DateValue) => {
		return (
			merged.disabled ||
			date.compare(startDate()) < 0 ||
			date.compare(endDate()) > 0 ||
			isDateInvalid(date, min(), max())
		);
	};

	const isCellUnavailable = (date: DateValue) => {
		return merged.isDateUnavailable?.(date) ?? false;
	};

	const updateAvailableRange = (date: DateValue | undefined) => {
		if (date && merged.isDateUnavailable && !merged.allowsNonContiguousRanges) {
			setAvailableRange({
				start: getNextUnavailableDate(
					date,
					startDate(),
					endDate(),
					isCellUnavailable,
					-1,
				),
				end: getNextUnavailableDate(
					date,
					startDate(),
					endDate(),
					isCellUnavailable,
					1,
				),
			});
		} else {
			setAvailableRange(undefined);
		}
	};

	const [anchorDate, setAnchorDate] = createControllableSignal<
		DateValue | undefined
	>({
		onChange: (value) => updateAvailableRange(value),
	});

	const highlightedRange = createMemo(() => {
		if (merged.selectionMode !== "range") {
			return undefined;
		}

		const resolvedAnchorDate = anchorDate();

		if (resolvedAnchorDate) {
			return makeCalendarDateRange(resolvedAnchorDate, focusedDate()!);
		}

		const { start, end } = asRangeValue(value()) ?? {};

		return makeCalendarDateRange(start, end);
	});

	const validationState = createMemo(() => {
		if (merged.validationState) {
			return merged.validationState;
		}

		if (calendarDateValue().length <= 0) {
			return null;
		}

		if (merged.selectionMode === "range" && anchorDate()) {
			return null;
		}

		const isSomeDateInvalid = calendarDateValue().some((date) => {
			return (
				merged.isDateUnavailable?.(date) || isDateInvalid(date, min(), max())
			);
		});

		return isSomeDateInvalid ? "invalid" : null;
	});

	const isCellSelected = (cellDate: DateValue) => {
		const isAvailable =
			!isCellDisabled(cellDate) && !isCellUnavailable(cellDate);

		if (merged.selectionMode === "range") {
			const { start, end } = highlightedRange() ?? {};

			const isInRange =
				start != null &&
				cellDate.compare(start) >= 0 &&
				end != null &&
				cellDate.compare(end) <= 0;

			return isInRange && isAvailable;
		}

		return (
			calendarDateValue().some((date) => isSameDay(cellDate, date)) &&
			isAvailable
		);
	};

	const isCellFocused = (date: DateValue) => {
		const resolvedFocusedDate = focusedDate();

		return (
			isFocused() &&
			resolvedFocusedDate != null &&
			isSameDay(date, resolvedFocusedDate)
		);
	};

	const isCellInvalid = (date: DateValue) => {
		if (merged.selectionMode === "range") {
			return (
				isDateInvalid(date, min(), max()) ||
				isDateInvalid(date, availableRange()?.start, availableRange()?.end)
			);
		}

		return isDateInvalid(date, min(), max());
	};

	const selectDate = (date: DateValue) => {
		if (merged.readOnly || merged.disabled) {
			return;
		}

		let newValue = getPreviousAvailableDate(
			constrainValue(date, min(), max()),
			startDate(),
			merged.isDateUnavailable,
		);

		if (!newValue) {
			return;
		}

		if (merged.selectionMode === "single") {
			setControlledValue((prev) => {
				const prevValue = asSingleValue(prev);

				if (!newValue) {
					return prevValue;
				}

				return convertValue(newValue, prevValue);
			});
		} else if (merged.selectionMode === "multiple") {
			setControlledValue((prev) => {
				const prevValue = asArrayValue(prev) ?? [];

				if (!newValue) {
					return prevValue;
				}

				newValue = convertValue(newValue, prevValue[0]);

				const index = prevValue.findIndex(
					(date) => newValue != null && isSameDay(date, newValue),
				);

				// If new value is already selected, remove it.
				if (index !== -1) {
					const nextValues = [...prevValue];
					nextValues.splice(index, 1);
					return sortDates(nextValues);
				}
				return sortDates([...prevValue, newValue]);
			});
		} else if (merged.selectionMode === "range") {
			if (!anchorDate()) {
				setAnchorDate(newValue);
			} else {
				setControlledValue((prev) => {
					const prevRange = asRangeValue(prev);

					const range = makeCalendarDateRange(anchorDate(), newValue);

					if (!range) {
						return prevRange;
					}

					return {
						start: convertValue(range.start, prevRange?.start),
						end: convertValue(range.end, prevRange?.end),
					};
				});

				setAnchorDate(undefined);
			}
		}
	};

	const selectFocusedDate = () => {
		selectDate(focusedDate()!);
	};

	const focusCell = (date: DateValue) => {
		setFocusedDate(constrainValue(date, min(), max()));

		if (!isFocused()) {
			setIsFocused(true);
		}
	};

	const highlightDate = (date: DateValue) => {
		if (anchorDate()) {
			focusCell(date);
		}
	};

	const focusNextDay = () => {
		focusCell(focusedDate()!.add({ days: 1 }));
	};

	const focusPreviousDay = () => {
		focusCell(focusedDate()!.subtract({ days: 1 }));
	};

	const focusNextRow = () => {
		const row = getNextRow(
			focusedDate()!,
			startDate(),
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		if (row) {
			setStartDate(row.startDate);
			focusCell(row.focusedDate);
		}
	};

	const focusPreviousRow = () => {
		const row = getPreviousRow(
			focusedDate()!,
			startDate(),
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		if (row) {
			setStartDate(row.startDate);
			focusCell(row.focusedDate);
		}
	};

	const focusNextPage = () => {
		const page = getNextPage(
			focusedDate()!,
			startDate(),
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		setFocusedDate(constrainValue(page.focusedDate, min(), max()));
		setStartDate(page.startDate);
	};

	const focusPreviousPage = () => {
		const page = getPreviousPage(
			focusedDate()!,
			startDate(),
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		setFocusedDate(constrainValue(page.focusedDate, min(), max()));
		setStartDate(page.startDate);
	};

	const focusSectionStart = () => {
		const section = getSectionStart(
			focusedDate()!,
			startDate(),
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		if (section) {
			setStartDate(section.startDate);
			focusCell(section.focusedDate);
		}
	};

	const focusSectionEnd = () => {
		const section = getSectionEnd(
			focusedDate()!,
			startDate(),
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		if (section) {
			setStartDate(section.startDate);
			focusCell(section.focusedDate);
		}
	};

	const focusNextSection = (larger: boolean) => {
		const section = getNextSection(
			focusedDate()!,
			startDate(),
			larger,
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		if (section) {
			setStartDate(section.startDate);
			focusCell(section.focusedDate);
		}
	};

	const focusPreviousSection = (larger: boolean) => {
		const section = getPreviousSection(
			focusedDate()!,
			startDate(),
			larger,
			merged.visibleDuration!,
			locale(),
			min(),
			max(),
		);

		if (section) {
			setStartDate(section.startDate);
			focusCell(section.focusedDate);
		}
	};

	const getDatesInWeek = (weekIndex: number, from: DateValue) => {
		let date = from.add({ weeks: weekIndex });
		const dates = [];

		date = startOfWeek(date, locale());

		// startOfWeek will clamp dates within the calendar system's valid range, which may
		// start in the middle of a week. In this case, add null placeholders.
		const dayOfWeek = getDayOfWeek(date, locale());
		for (let i = 0; i < dayOfWeek; i++) {
			dates.push(null);
		}

		while (dates.length < 7) {
			dates.push(date);
			const nextDate = date.add({ days: 1 });
			if (isSameDay(date, nextDate)) {
				break;
			}
			date = nextDate;
		}

		// Add null placeholders if at the end of the calendar system.
		while (dates.length < 7) {
			dates.push(null);
		}

		return dates;
	};

	createInteractOutside(
		{
			onInteractOutside: () => {
				// Stop range selection on interaction outside the calendar, e.g. tabbing away from the calendar.
				if (merged.selectionMode === "range" && anchorDate()) {
					selectFocusedDate();
				}
			},
		},
		() => ref,
	);

	// Reset focused date and visible range when calendar changes.
	let lastCalendarIdentifier = calendar().identifier;

	createEffect(
		() => calendar(),
		(cal) => {
			if (cal.identifier !== lastCalendarIdentifier) {
				const newFocusedDate = toCalendar(focusedDate()!, cal);

				setStartDate(
					alignCenter(
						newFocusedDate,
						merged.visibleDuration!,
						locale(),
						min(),
						max(),
					),
				);

				setFocusedDate(newFocusedDate);

				lastCalendarIdentifier = cal.identifier;
			}
		},
	);

	// Adjust start/focused dates when visible duration, locale, or min/max change.
	createEffect(
		() => {
			const adjust = getAdjustedDateFn(
				merged.visibleDuration!,
				locale(),
				min(),
				max(),
			);

			return adjust({
				startDate: startDate(),
				focusedDate: focusedDate()!,
			});
		},
		(adjustment) => {
			setStartDate(adjustment.startDate);
			setFocusedDate(adjustment.focusedDate);
		},
	);

	// Announce when the visible date range changes only when not focused on the grid.
	createEffect(
		() => ({
			notFocused: !isFocused(),
			description: visibleRangeDescription(),
		}),
		({ notFocused, description }) => {
			if (notFocused) {
				announce(description);
			}
		},
	);

	// Announce when the selected value changes.
	createEffect(
		() => {
			let description: string | null | undefined;

			if (merged.selectionMode === "single") {
				const date = asSingleValue(value());
				description =
					date &&
					getSelectedDateDescription(merged.translations!, date, timeZone());
			} else if (merged.selectionMode === "multiple") {
				const dates = asArrayValue(value());
				description = dates
					?.map((date) =>
						getSelectedDateDescription(merged.translations!, date, timeZone()),
					)
					.join(", ");
			} else if (merged.selectionMode === "range") {
				const dateRange = asRangeValue(value()) ?? {};
				description = getSelectedDateRangeDescription(
					merged.translations!,
					dateRange,
					anchorDate(),
					timeZone(),
				);
			}

			return description;
		},
		(description) => {
			if (description) {
				announce(description, "polite", 4000);
			}
		},
	);

	// In "range" selection mode, update the available range if the visible range changes.
	createEffect(
		() => { startDate(); endDate(); },
		() => {
			if (merged.selectionMode === "range") {
				updateAvailableRange(anchorDate());
			}
		},
	);

	let isVirtualClick = false;

	// Handle range drag-to-select pointer events.
	createEffect(
		() => ({
			enabled: !isServer && merged.selectionMode === "range" && !!ref,
		}),
		({ enabled }) => {
			if (!enabled) return;

			const win = getWindow(ref!);
			const doc = getDocument(ref!);

			// We need to ignore virtual pointer events from VoiceOver due to these bugs.
			// https://bugs.webkit.org/show_bug.cgi?id=222627
			// https://bugs.webkit.org/show_bug.cgi?id=223202
			const onWindowPointerDown = (e: PointerEvent) => {
				isVirtualClick = e.width === 0 && e.height === 0;
			};

			// Stop range selection when pressing or releasing a pointer outside the calendar body,
			// except when pressing the next or previous buttons to switch months.
			const endDragging = (e: PointerEvent) => {
				if (isVirtualClick) {
					isVirtualClick = false;
					return;
				}

				setIsDragging(false);
				if (!anchorDate()) {
					return;
				}

				const target = e.target as Element;
				if (
					contains(ref, doc.activeElement) &&
					(!contains(ref, target) ||
						!target.closest('button, [role="button"]'))
				) {
					selectFocusedDate();
				}
			};

			// Prevent touch scrolling while dragging
			const onTouchMove = (e: TouchEvent) => {
				if (isDragging()) {
					e.preventDefault();
				}
			};

			win.addEventListener("pointerdown", onWindowPointerDown);
			win.addEventListener("pointerup", endDragging);
			win.addEventListener("pointercancel", endDragging);
			ref!.addEventListener("touchmove", onTouchMove, {
				passive: false,
				capture: true,
			});

			return () => {
				win.removeEventListener("pointerdown", onWindowPointerDown);
				win.removeEventListener("pointerup", endDragging);
				win.removeEventListener("pointercancel", endDragging);
				ref?.removeEventListener("touchmove", onTouchMove, { capture: true });
			};
		},
	);

	const dataset: Accessor<CalendarDataSet> = createMemo(() => ({}));

	const context: CalendarContextValue = {
		dataset,
		value,
		isDisabled: () => merged.disabled ?? false,
		isReadOnly: () => merged.readOnly ?? false,
		isDragging,
		isCellUnavailable,
		isCellDisabled,
		isCellSelected,
		isCellFocused,
		isCellInvalid,
		validationState,
		startDate,
		endDate,
		anchorDate,
		focusedDate: () => focusedDate()!,
		visibleDuration: () => merged.visibleDuration!,
		selectionMode: () => merged.selectionMode!,
		locale,
		highlightedRange,
		direction,
		min,
		max,
		timeZone,
		translations: () => merged.translations!,
		setStartDate,
		setAnchorDate,
		setIsFocused,
		setIsDragging,
		selectFocusedDate,
		selectDate,
		highlightDate,
		focusCell,
		focusNextDay,
		focusPreviousDay,
		focusNextPage,
		focusPreviousPage,
		focusNextRow,
		focusPreviousRow,
		focusSectionStart,
		focusSectionEnd,
		focusNextSection,
		focusPreviousSection,
		getDatesInWeek,
	};

	return (
		<CalendarContext value={context}>
			<Polymorphic<CalendarRootRenderProps>
				ref={mergeRefs((el) => (ref = el), merged.ref)}
				as="div"
				role="group"
				aria-label={ariaLabel()}
				{...others}
			/>
		</CalendarContext>
	);
}

function convertValue(
	newValue: DateValue,
	oldValue?: DateValue | null,
): DateValue {
	// The display calendar should not have any effect on the emitted value.
	// Emit dates in the same calendar as the original value, if any, otherwise gregorian.
	// biome-ignore lint/style/noParameterAssign: convert parameter
	newValue = toCalendar(
		newValue,
		oldValue?.calendar || new GregorianCalendar(),
	);

	// Preserve time if the input value had one.
	if (oldValue && "hour" in oldValue) {
		return oldValue.set(newValue);
	}

	return newValue;
}
