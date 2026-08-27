/*
 * Portions of this file are based on code from corvu.
 * MIT Licensed, Copyright (c) 2023-2025 Jasmin Noetzli.
 *
 * Credits to the corvu team:
 * https://github.com/corvudev/corvu/blob/main/packages/calendar/src/CellTrigger.tsx
 *
 * Date formatting/labeling and the min/max-aware ARIA description are carried
 * over from the original react-spectrum-derived implementation, since corvu's
 * cell trigger (built on native `Date`) has no equivalent to
 * `@internationalized/date`'s calendar-system-aware formatting:
 * https://github.com/adobe/react-spectrum/blob/a8903d3b8c462b85cc34e8565e1a1084827d0a29/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { isSameDay, isSameMonth, isWeekend } from "@internationalized/date";
import { callHandler } from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import {
	createEffect,
	createMemo,
	createSignal,
	omit,
	type Ref,
	untrack,
} from "solid-js";

import { createDateFormatter } from "../i18n/index.tsx";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useCalendarContext } from "./calendar-context.tsx";
import { useCalendarGridBodyCellContext } from "./calendar-grid-body-cell-context.tsx";
import { useCalendarGridContext } from "./calendar-grid-context.tsx";
import {
	asRangeValue,
	getEraFormat,
	getSelectedDateDescription,
} from "./utils.ts";

export interface CalendarGridBodyCellTriggerOptions {
	/** Whether the cell trigger is disabled. */
	disabled?: boolean;
}

export interface CalendarGridBodyCellTriggerCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	ref: Ref<T>;
	children?: JSX.Element;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface CalendarGridBodyCellTriggerRenderProps
	extends CalendarGridBodyCellTriggerCommonProps {
	role: "button";
	tabIndex: number | undefined;
	children: JSX.Element;
	disabled: boolean | undefined;
	"aria-disabled": "true" | undefined;
	"aria-invalid": "true" | undefined;
	"aria-label": string;
	"data-disabled": string | undefined;
	"data-invalid": string | undefined;
	"data-selected": string | undefined;
	"data-value": string;
	"data-type": "day";
	"data-today": string | undefined;
	"data-weekend": string | undefined;
	"data-highlighted": string | undefined;
	"data-unavailable": string | undefined;
	"data-selection-start": string | undefined;
	"data-selection-end": string | undefined;
	"data-outside-visible-range": string | undefined;
	"data-outside-month": string | undefined;
}

export type CalendarGridBodyCellTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridBodyCellTriggerOptions &
	Partial<CalendarGridBodyCellTriggerCommonProps<ElementOf<T>>>;

/**
 * A calendar cell trigger selects its date on click, following corvu's
 * click-only selection model — including for "range" mode, where the first
 * click sets the range's start and the second click commits its end (no
 * pointer-drag selection).
 */
export function CalendarGridBodyCellTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CalendarGridBodyCellTriggerProps<T>>,
) {
	const [ref, setRef] = createSignal<HTMLElement>();

	const rootContext = useCalendarContext();
	const gridContext = useCalendarGridContext();
	const context = useCalendarGridBodyCellContext();

	const p = props as CalendarGridBodyCellTriggerProps;

	const others = omit(p, "disabled", "onClick", "onKeyDown");

	const isDisabled = () => p.disabled || context.isDisabled();

	const isDateWeekend = () => {
		return isWeekend(context.date(), rootContext.locale());
	};

	const isOutsideVisibleRange = () => {
		return (
			context.date().compare(rootContext.startDate()) < 0 ||
			context.date().compare(rootContext.endDate()) > 0
		);
	};

	const isOutsideMonth = () => {
		return !isSameMonth(gridContext.startDate(), context.date());
	};

	const isSelectionStart = () => {
		if (rootContext.selectionMode() !== "range") {
			return false;
		}

		const start = rootContext.highlightedRange()?.start;

		return start != null && isSameDay(context.date(), start);
	};

	const isSelectionEnd = () => {
		if (rootContext.selectionMode() !== "range") {
			return false;
		}

		const end = rootContext.highlightedRange()?.end;

		return end != null && isSameDay(context.date(), end);
	};

	const tabIndex = createMemo(() => {
		if (!isDisabled()) {
			return isSameDay(context.date(), rootContext.focusedDate()) ? 0 : -1;
		}

		return undefined;
	});

	const labelDateFormatter = createDateFormatter(() => ({
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		era: getEraFormat(context.date()),
		timeZone: rootContext.timeZone(),
	}));

	const cellDateFormatter = createDateFormatter(() => ({
		day: "numeric",
		timeZone: rootContext.timeZone(),
		calendar: context.date().calendar.identifier,
	}));

	const nativeDate = createMemo(() => {
		return context.date().toDate(rootContext.timeZone());
	});

	const formattedDate = createMemo(() => {
		return cellDateFormatter()
			.formatToParts(nativeDate())
			.find((part) => part.type === "day")?.value;
	});

	const ariaLabel = createMemo(() => {
		let label = "";

		// If this is a range calendar, add a description of the full selected range
		// to the first and last selected date.
		if (rootContext.selectionMode() === "range" && !rootContext.anchorDate()) {
			const { start, end } = asRangeValue(rootContext.value()) ?? {};

			if (
				start &&
				end &&
				(isSameDay(context.date(), start) || isSameDay(context.date(), end))
			) {
				label = `${getSelectedDateDescription(
					rootContext.locale(),
					rootContext.translations(),
					context.date(),
					rootContext.timeZone(),
				)}, `;
			}
		}

		label += labelDateFormatter().format(nativeDate());
		if (context.isDateToday()) {
			// If date is today, set appropriate string depending on selected state:
			label = rootContext.translations().todayDate(label, context.isSelected());
		} else if (context.isSelected()) {
			// If date is selected but not today:
			label = rootContext.translations().dateSelected(label);
		}

		const min = rootContext.min();
		const max = rootContext.max();

		if (min && isSameDay(context.date(), min)) {
			label += `, ${rootContext.translations().minimumDate}`;
		} else if (max && isSameDay(context.date(), max)) {
			label += `, ${rootContext.translations().maximumDate}`;
		}

		return label;
	});

	// Selects the date on click, regardless of selection mode — for "range" mode,
	// `selectDate` itself decides whether this click sets the anchor (first click)
	// or commits the range (second click).
	const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
		callHandler(e, p.onClick);

		if (rootContext.isReadOnly()) {
			rootContext.focusCell(context.date());
			return;
		}

		if (context.isSelectable()) {
			rootContext.selectDate(context.date());
			rootContext.focusCell(context.date());
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
		callHandler(e, p.onKeyDown);

		if (!["Enter", " "].includes(e.key)) {
			return;
		}

		if (rootContext.isReadOnly()) {
			rootContext.focusCell(context.date());
			return;
		}

		if (rootContext.selectionMode() === "range" && !rootContext.anchorDate()) {
			// Prevent `Calendar.Grid` to select the cell.
			e.stopPropagation();

			// For range selection, auto-advance the focused date by one if using keyboard.
			// This gives an indication that you're selecting a range rather than a single date.
			rootContext.selectDate(context.date());
			let nextDay = context.date().add({ days: 1 });

			if (rootContext.isCellInvalid(nextDay)) {
				nextDay = context.date().subtract({ days: 1 });
			}

			if (!rootContext.isCellInvalid(nextDay)) {
				rootContext.focusCell(nextDay);
			}
		}
	};

	// Focus the button in the DOM when the date become the focused/highlighted one.
	createEffect(
		() => context.isFocused(),
		(focused) => {
			if (focused) {
				const el = untrack(ref);
				el?.focus({ preventScroll: true });
			}
		},
	);

	return (
		<Polymorphic<CalendarGridBodyCellTriggerRenderProps>
			as="div"
			ref={[setRef, p.ref]}
			role="button"
			tabIndex={tabIndex()}
			aria-disabled={!context.isSelectable() ? "true" : undefined}
			aria-invalid={context.isInvalid() ? "true" : undefined}
			aria-label={ariaLabel()}
			data-disabled={isDisabled() ? "" : undefined}
			data-invalid={context.isInvalid() ? "" : undefined}
			data-selected={context.isSelected() ? "" : undefined}
			data-value={context.date().toString()}
			data-type="day"
			data-today={context.isDateToday() ? "" : undefined}
			data-weekend={isDateWeekend() ? "" : undefined}
			data-highlighted={context.isFocused() ? "" : undefined}
			data-unavailable={context.isUnavailable() ? "" : undefined}
			data-selection-start={isSelectionStart() ? "" : undefined}
			data-selection-end={isSelectionEnd() ? "" : undefined}
			data-outside-visible-range={isOutsideVisibleRange() ? "" : undefined}
			data-outside-month={isOutsideMonth() ? "" : undefined}
			{...others}
			disabled={isDisabled()}
			onClick={onClick}
			onKeyDown={onKeyDown}
		>
			{formattedDate()}
		</Polymorphic>
	);
}
