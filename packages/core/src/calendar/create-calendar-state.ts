/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 *
 * Reworked for native `Date` values — no calendar-system (`createCalendar`) or explicit
 * time-zone concept, so the historical calendar-identifier-change effect and per-value
 * time-zone tracking are gone.
 */

import type { RangeValue, ValidationState } from "@kobalte/utils";
import {
	type Accessor,
	createEffect,
	createMemo,
	createSignal,
	untrack,
} from "solid-js";

import {
	type Direction,
	getReadingDirection,
	useLocale,
} from "../i18n/index.tsx";
import { announce } from "../live-announcer/index.ts";
import { createControllableSignal } from "../primitives/index.ts";
import {
	CALENDAR_INTL_MESSAGES,
	type CalendarIntlTranslations,
} from "./calendar.intl.ts";
import {
	addDuration,
	compareDates,
	type DateDuration,
	isSameDay,
	maxDate,
	minDate,
	startOfWeek,
	subtractDuration,
	todayDate,
} from "./date-math.ts";
import type {
	CalendarSelectionMode,
	DateAlignment,
	DateValue,
} from "./types.ts";
import {
	alignCenter,
	alignDate,
	asArrayValue,
	asRangeValue,
	asSingleValue,
	constrainValue,
	convertValue,
	getAdjustedDateFn,
	getArrayValueOfSelection,
	getEndDate,
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
} from "./utils.ts";

export interface CreateCalendarStateProps {
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

	/** The selection mode of the calendar. */
	selectionMode?: CalendarSelectionMode;

	/** The controlled value of the calendar. */
	value?: DateValue | DateValue[] | RangeValue<DateValue> | null;

	/** The default value of the calendar. */
	defaultValue?: DateValue | DateValue[] | RangeValue<DateValue> | null;

	/** Event handler called when the value changes. */
	onChange?: (value: any) => void;

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
	 * determines whether non-contiguous ranges may be selected.
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
}

export interface CalendarState {
	value: Accessor<
		DateValue | DateValue[] | RangeValue<DateValue> | null | undefined
	>;
	isDisabled: Accessor<boolean>;
	isReadOnly: Accessor<boolean>;
	isCellSelected: (date: DateValue) => boolean;
	isCellFocused: (date: DateValue) => boolean;
	isCellDisabled: (date: DateValue) => boolean;
	isCellUnavailable: (date: DateValue) => boolean;
	isCellInvalid: (date: DateValue) => boolean;
	validationState: Accessor<ValidationState | null>;
	startDate: Accessor<DateValue>;
	endDate: Accessor<DateValue>;
	anchorDate: Accessor<DateValue | undefined>;
	focusedDate: Accessor<DateValue>;
	visibleDuration: Accessor<DateDuration>;
	selectionMode: Accessor<CalendarSelectionMode>;
	locale: Accessor<string>;
	direction: Accessor<Direction>;
	min: Accessor<DateValue | undefined>;
	max: Accessor<DateValue | undefined>;
	highlightedRange: Accessor<RangeValue<DateValue> | undefined>;
	translations: Accessor<CalendarIntlTranslations>;
	setStartDate: (date: DateValue) => void;
	setAnchorDate: (date: DateValue | undefined) => void;
	setIsFocused: (value: boolean) => void;
	selectFocusedDate: () => void;
	selectDate: (date: DateValue) => void;
	focusCell: (date: DateValue) => void;
	focusNextDay: () => void;
	focusPreviousDay: () => void;
	focusNextPage: () => void;
	focusPreviousPage: () => void;
	focusNextRow: () => void;
	focusPreviousRow: () => void;
	focusSectionStart: () => void;
	focusSectionEnd: () => void;
	focusNextSection: (larger: boolean) => void;
	focusPreviousSection: (larger: boolean) => void;
	getDatesInWeek: (
		weekIndex: number,
		from: DateValue,
	) => Array<DateValue | null>;
}

/**
 * Provides state management for a `Calendar` component.
 * Handles focused-date tracking, visible-range pagination, and single/multiple/range selection,
 * independently from the DOM.
 */
export function createCalendarState(
	props: CreateCalendarStateProps,
): CalendarState {
	const localeContext = useLocale();

	const visibleDuration = () => props.visibleDuration ?? { months: 1 };
	const selectionMode = () => props.selectionMode ?? "single";

	const locale = createMemo(() => props.locale ?? localeContext.locale());

	const direction = createMemo(() => {
		return props.locale
			? getReadingDirection(locale())
			: localeContext.direction();
	});

	const [value, setControlledValue] = createControllableSignal<
		DateValue | DateValue[] | RangeValue<DateValue> | null | undefined
	>({
		value: () => props.value,
		defaultValue: () => props.defaultValue,
		onChange: (value) => props.onChange?.(value),
	});

	const [availableRange, setAvailableRange] = createSignal<
		RangeValue<DateValue | undefined> | undefined
	>(undefined, { ownedWrite: true });

	const selectionAlignment = createMemo((): DateAlignment => {
		if (selectionMode() === "range") {
			const valueRange = asRangeValue(value());

			if (valueRange?.start && valueRange.end) {
				const start = alignCenter(
					valueRange.start,
					visibleDuration(),
					locale(),
					props.minValue,
					props.maxValue,
				);

				const end = subtractDuration(addDuration(start, visibleDuration()), {
					days: 1,
				});

				if (compareDates(valueRange.end, end) > 0) {
					return "start";
				}
			}

			return "center";
		}

		return props.selectionAlignment ?? "center";
	});

	const min = createMemo((): DateValue | undefined => {
		const startRange = availableRange()?.start;

		if (selectionMode() === "range" && props.minValue && startRange) {
			return maxDate(props.minValue, startRange) ?? undefined;
		}

		return props.minValue;
	});

	const max = createMemo((): DateValue | undefined => {
		const endRange = availableRange()?.end;

		if (selectionMode() === "range" && props.maxValue && endRange) {
			return minDate(props.maxValue, endRange) ?? undefined;
		}

		return props.maxValue;
	});

	const selectedDates = createMemo(() => {
		return getArrayValueOfSelection(selectionMode(), value());
	});

	const focusedDateFromProps = createMemo(() => {
		return props.focusedValue
			? constrainValue(props.focusedValue, min(), max())
			: undefined;
	});

	const defaultFocusedDate = createMemo(() => {
		return constrainValue(
			props.defaultFocusedValue ?? selectedDates()[0] ?? todayDate(),
			min(),
			max(),
		);
	});

	const [focusedDate, setFocusedDate] = createControllableSignal({
		value: focusedDateFromProps,
		defaultValue: defaultFocusedDate,
		onChange: (value) => props.onFocusChange?.(value!),
	});

	// These signals are mutated imperatively from the public state API
	// (`focusCell`/`focusNextDay`/etc.) rather than purely reactive derivation,
	// so they need `ownedWrite: true` to allow writes from within the owning
	// scope (matching `@solid-primitives/controlled-signal`'s own internal use
	// of this option for the same reason).
	const [startDate, setStartDate] = createSignal(
		untrack(() =>
			alignDate(
				focusedDate()!,
				selectionAlignment(),
				visibleDuration(),
				locale(),
				min(),
				max(),
			),
		),
		{ ownedWrite: true },
	);

	const endDate = createMemo(() => {
		return getEndDate(startDate(), visibleDuration());
	});

	const [isFocused, setIsFocused] = createSignal(
		untrack(() => props.autoFocus || false),
		{ ownedWrite: true },
	);

	const visibleRangeDescription = createMemo(() => {
		return getVisibleRangeDescription(
			locale(),
			props.translations ?? CALENDAR_INTL_MESSAGES,
			startDate(),
			endDate(),
			true,
		);
	});

	const isCellDisabled = (date: DateValue) => {
		return (
			!!props.disabled ||
			compareDates(date, startDate()) < 0 ||
			compareDates(date, endDate()) > 0 ||
			isDateInvalid(date, min(), max())
		);
	};

	const isCellUnavailable = (date: DateValue) => {
		return props.isDateUnavailable?.(date) ?? false;
	};

	const updateAvailableRange = (date: DateValue | undefined) => {
		if (date && props.isDateUnavailable && !props.allowsNonContiguousRanges) {
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
		if (selectionMode() !== "range") {
			return undefined;
		}

		const resolvedAnchorDate = anchorDate();

		if (resolvedAnchorDate) {
			return makeCalendarDateRange(resolvedAnchorDate, focusedDate()!);
		}

		const { start, end } = asRangeValue(value()) ?? {};

		return makeCalendarDateRange(start, end);
	});

	const validationState = createMemo((): ValidationState | null => {
		if (props.validationState) {
			return props.validationState;
		}

		if (selectedDates().length <= 0) {
			return null;
		}

		if (selectionMode() === "range" && anchorDate()) {
			return null;
		}

		const isSomeDateInvalid = selectedDates().some((date) => {
			return (
				props.isDateUnavailable?.(date) || isDateInvalid(date, min(), max())
			);
		});

		return isSomeDateInvalid ? "invalid" : null;
	});

	const isCellSelected = (cellDate: DateValue) => {
		const isAvailable =
			!isCellDisabled(cellDate) && !isCellUnavailable(cellDate);

		if (selectionMode() === "range") {
			const { start, end } = highlightedRange() ?? {};

			const isInRange =
				start != null &&
				compareDates(cellDate, start) >= 0 &&
				end != null &&
				compareDates(cellDate, end) <= 0;

			return isInRange && isAvailable;
		}

		return (
			selectedDates().some((date) => isSameDay(cellDate, date)) && isAvailable
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
		if (selectionMode() === "range") {
			return (
				isDateInvalid(date, min(), max()) ||
				isDateInvalid(date, availableRange()?.start, availableRange()?.end)
			);
		}

		return isDateInvalid(date, min(), max());
	};

	const selectDate = (date: DateValue) => {
		if (props.readOnly || props.disabled) {
			return;
		}

		let newValue = getPreviousAvailableDate(
			constrainValue(date, min(), max()),
			startDate(),
			props.isDateUnavailable,
		);

		if (!newValue) {
			return;
		}

		if (selectionMode() === "single") {
			setControlledValue((prev) => {
				const prevValue = asSingleValue(prev);

				if (!newValue) {
					return prevValue;
				}

				return convertValue(newValue, prevValue);
			});
		} else if (selectionMode() === "multiple") {
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
		} else if (selectionMode() === "range") {
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

	const focusNextDay = () => {
		focusCell(addDuration(focusedDate()!, { days: 1 }));
	};

	const focusPreviousDay = () => {
		focusCell(subtractDuration(focusedDate()!, { days: 1 }));
	};

	const focusNextRow = () => {
		const row = getNextRow(
			focusedDate()!,
			startDate(),
			visibleDuration(),
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
			visibleDuration(),
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
			visibleDuration(),
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
			visibleDuration(),
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
			visibleDuration(),
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
			visibleDuration(),
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
			visibleDuration(),
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
			visibleDuration(),
			locale(),
			min(),
			max(),
		);

		if (section) {
			setStartDate(section.startDate);
			focusCell(section.focusedDate);
		}
	};

	// Native `Date` has no calendar-system boundary to clamp against (unlike
	// `@internationalized/date`, which could clamp `startOfWeek` short of a
	// calendar's minimum date), so this can never actually produce a `null`
	// placeholder in practice — the `Array<DateValue | null>` return type is
	// kept only for backward compatibility with existing render-prop consumers.
	const getDatesInWeek = (
		weekIndex: number,
		from: DateValue,
	): Array<DateValue | null> => {
		const weekStart = startOfWeek(
			addDuration(from, { weeks: weekIndex }),
			locale(),
		);
		return Array.from({ length: 7 }, (_, i) =>
			addDuration(weekStart, { days: i }),
		);
	};

	createEffect(
		() => {
			const adjust = getAdjustedDateFn(
				visibleDuration(),
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

	// Announce when the visible date range changes only when pressing the Previous or Next triggers.
	createEffect(
		() => visibleRangeDescription(),
		(description) => {
			if (!untrack(isFocused)) {
				announce(description);
			}
		},
	);

	// Announce when the selected value changes
	createEffect(
		() => {
			let description: string | null | undefined;

			if (selectionMode() === "single") {
				const date = asSingleValue(value());
				description =
					date &&
					getSelectedDateDescription(
						locale(),
						props.translations ?? CALENDAR_INTL_MESSAGES,
						date,
					);
			} else if (selectionMode() === "multiple") {
				const dates = asArrayValue(value());
				description = dates
					?.map((date) =>
						getSelectedDateDescription(
							locale(),
							props.translations ?? CALENDAR_INTL_MESSAGES,
							date,
						),
					)
					.join(", ");
			} else if (selectionMode() === "range") {
				const dateRange = asRangeValue(value()) ?? {};
				description = getSelectedDateRangeDescription(
					locale(),
					props.translations ?? CALENDAR_INTL_MESSAGES,
					dateRange,
					anchorDate(),
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
		() => [startDate(), endDate()] as const,
		() => {
			untrack(() => {
				if (selectionMode() === "range") {
					updateAvailableRange(anchorDate());
				}
			});
		},
	);

	return {
		value,
		isDisabled: () => props.disabled ?? false,
		isReadOnly: () => props.readOnly ?? false,
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
		visibleDuration,
		selectionMode,
		locale,
		highlightedRange,
		direction,
		min,
		max,
		translations: () => props.translations ?? CALENDAR_INTL_MESSAGES,
		setStartDate,
		setAnchorDate,
		setIsFocused,
		selectFocusedDate,
		selectDate,
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
}
