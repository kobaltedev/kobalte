/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/a8903d3b8c462b85cc34e8565e1a1084827d0a29/packages/@react-aria/calendar/src/useCalendarCell.ts
 */

import { isSameDay, isSameMonth, isWeekend } from "@internationalized/date";
import {
	callHandler,
	focusWithoutScrolling,
	getWindow,
	mergeRefs,
} from "@kobalte/utils";
import type { JSX, ValidComponent } from "@solidjs/web";
import { createEffect, createMemo, omit } from "solid-js";

import { createDateFormatter } from "../i18n";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGriBodyCellContext } from "./calendar-grid-body-cell-context";
import { useCalendarGridContext } from "./calendar-grid-context";
import {
	asRangeValue,
	getEraFormat,
	getSelectedDateDescription,
} from "./utils";

export interface CalendarGridBodyCellTriggerOptions {
	/** Whether the cell trigger is disabled. */
	disabled?: boolean;
}

export interface CalendarGridBodyCellTriggerCommonProps<
	T extends HTMLElement = HTMLDivElement,
> {
	ref: T | ((el: T) => void);
	onPointerEnter: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerDown: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerUp: JSX.EventHandlerUnion<T, PointerEvent>;
	onPointerLeave: JSX.EventHandlerUnion<T, PointerEvent>;
	onClick: JSX.EventHandlerUnion<T, MouseEvent>;
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
}

export interface CalendarGridBodyCellTriggerRenderProps
	extends CalendarGridBodyCellTriggerCommonProps<HTMLDivElement> {
	role: "button";
	tabIndex: number | undefined;
	disabled: boolean;
	"aria-disabled": boolean | undefined;
	"aria-invalid": boolean | undefined;
	"aria-label": string;
	"data-disabled": boolean | undefined;
	"data-invalid": boolean | undefined;
	"data-selected": boolean | undefined;
	"data-value": string;
	"data-type": string;
	"data-today": boolean | undefined;
	"data-weekend": boolean | undefined;
	"data-highlighted": boolean | undefined;
	"data-unavailable": boolean | undefined;
	"data-selection-start": boolean | undefined;
	"data-selection-end": boolean | undefined;
	"data-outside-visible-range": boolean | undefined;
	"data-outside-month": boolean | undefined;
	onContextMenu: JSX.EventHandlerUnion<HTMLDivElement, Event>;
	children: string | undefined;
}

export type CalendarGridBodyCellTriggerProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridBodyCellTriggerOptions &
	Partial<CalendarGridBodyCellTriggerCommonProps<ElementOf<T>>>;

export function CalendarGridBodyCellTrigger<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CalendarGridBodyCellTriggerProps<T>>,
) {
	let ref: HTMLDivElement | undefined;

	const rootContext = useCalendarContext();
	const gridContext = useCalendarGridContext();
	const context = useCalendarGriBodyCellContext();

	const others = omit(
		props as CalendarGridBodyCellTriggerProps,
		"ref",
		"disabled",
		"onPointerEnter",
		"onPointerDown",
		"onPointerUp",
		"onPointerLeave",
		"onClick",
		"onKeyDown",
	);

	const isDisabled = () =>
		(props as CalendarGridBodyCellTriggerProps).disabled || context.isDisabled();

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
					rootContext.translations(),
					context.date(),
					rootContext.timeZone(),
				)}, `;
			}
		}

		label += labelDateFormatter().format(nativeDate());
		if (context.isDateToday()) {
			label = rootContext.translations().todayDate(label, context.isSelected());
		} else if (context.isSelected()) {
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

	let isPointerDown = false;
	let isAnchorPressed = false;
	let isRangeBoundaryPressed = false;
	let touchDragTimerRef: number | undefined;

	const onPressEnd = () => {
		isRangeBoundaryPressed = false;
		isAnchorPressed = false;

		if (touchDragTimerRef != null) {
			getWindow(ref).clearTimeout(touchDragTimerRef);
			touchDragTimerRef = undefined;
		}
	};

	const onPointerEnter: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarGridBodyCellTriggerProps).onPointerEnter as JSX.EventHandlerUnion<HTMLDivElement, PointerEvent>);

		if (
			rootContext.selectionMode() === "range" &&
			(e.pointerType !== "touch" || rootContext.isDragging()) &&
			context.isSelectable()
		) {
			rootContext.highlightDate(context.date());
		}
	};

	const onPointerLeave: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarGridBodyCellTriggerProps).onPointerLeave as JSX.EventHandlerUnion<HTMLDivElement, PointerEvent>);

		if (isPointerDown) {
			onPressEnd();
		}
	};

	const onPointerDown: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarGridBodyCellTriggerProps).onPointerDown as JSX.EventHandlerUnion<HTMLDivElement, PointerEvent>);
		isPointerDown = true;

		if ("releasePointerCapture" in e.target) {
			(e.target as Element).releasePointerCapture(e.pointerId);
		}

		if (rootContext.isReadOnly()) {
			rootContext.focusCell(context.date());
			return;
		}

		if (rootContext.selectionMode() === "range" && !rootContext.anchorDate()) {
			const highlightedRange = rootContext.highlightedRange();

			if (highlightedRange && !context.isInvalid()) {
				if (isSameDay(context.date(), highlightedRange.start)) {
					rootContext.setAnchorDate(highlightedRange.end);
					rootContext.focusCell(context.date());
					rootContext.setIsDragging(true);
					isRangeBoundaryPressed = true;
					return;
				}
				if (isSameDay(context.date(), highlightedRange.end)) {
					rootContext.setAnchorDate(highlightedRange.start);
					rootContext.focusCell(context.date());
					rootContext.setIsDragging(true);
					isRangeBoundaryPressed = true;
					return;
				}
			}

			const startDragging = () => {
				rootContext.setIsDragging(true);
				touchDragTimerRef = undefined;

				rootContext.selectDate(context.date());
				rootContext.focusCell(context.date());
				isAnchorPressed = true;
			};

			if (e.pointerType === "touch") {
				touchDragTimerRef = getWindow(ref).setTimeout(startDragging, 200);
			} else {
				startDragging();
			}
		}
	};

	const onPointerUp: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarGridBodyCellTriggerProps).onPointerUp as JSX.EventHandlerUnion<HTMLDivElement, PointerEvent>);
		isPointerDown = false;

		if (rootContext.isReadOnly() || rootContext.selectionMode() !== "range") {
			onPressEnd();
			return;
		}

		if (touchDragTimerRef != null) {
			rootContext.selectDate(context.date());
			rootContext.focusCell(context.date());
		}

		if (isRangeBoundaryPressed) {
			rootContext.setAnchorDate(context.date());
		} else if (rootContext.anchorDate() && !isAnchorPressed) {
			rootContext.selectDate(context.date());
			rootContext.focusCell(context.date());
		}

		onPressEnd();
	};

	const onClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (e) => {
		callHandler(e, (props as CalendarGridBodyCellTriggerProps).onClick as JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>);

		if (rootContext.selectionMode() !== "range" && context.isSelectable()) {
			rootContext.selectDate(context.date());
			rootContext.focusCell(context.date());
		}
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, (props as CalendarGridBodyCellTriggerProps).onKeyDown as JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent>);

		if (!["Enter", " "].includes(e.key)) {
			return;
		}

		if (rootContext.isReadOnly()) {
			rootContext.focusCell(context.date());
			return;
		}

		if (rootContext.selectionMode() === "range" && !rootContext.anchorDate()) {
			e.stopPropagation();

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

	// Focus the element when it becomes the focused date.
	createEffect(
		() => context.isFocused(),
		(focused) => {
			if (focused && ref) {
				focusWithoutScrolling(ref);
			}
		},
	);

	return (
		<Polymorphic<CalendarGridBodyCellTriggerRenderProps>
			as="div"
			ref={mergeRefs((el) => (ref = el as HTMLDivElement), (props as CalendarGridBodyCellTriggerProps).ref as ((el: HTMLDivElement) => void) | undefined)}
			role="button"
			tabIndex={tabIndex()}
			disabled={isDisabled()}
			aria-disabled={!context.isSelectable() || undefined}
			aria-invalid={context.isInvalid() || undefined}
			aria-label={ariaLabel()}
			data-disabled={isDisabled() || undefined}
			data-invalid={context.isInvalid() || undefined}
			data-selected={context.isSelected() || undefined}
			data-value={context.date().toString()}
			data-type="day"
			data-today={context.isDateToday() || undefined}
			data-weekend={isDateWeekend() || undefined}
			data-highlighted={context.isFocused() || undefined}
			data-unavailable={context.isUnavailable() || undefined}
			data-selection-start={isSelectionStart() || undefined}
			data-selection-end={isSelectionEnd() || undefined}
			data-outside-visible-range={isOutsideVisibleRange() || undefined}
			data-outside-month={isOutsideMonth() || undefined}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			onPointerDown={onPointerDown}
			onPointerUp={onPointerUp}
			onClick={onClick}
			onKeyDown={onKeyDown}
			onContextMenu={(e: Event) => {
				e.preventDefault();
			}}
			{...others}
		>
			{formattedDate()}
		</Polymorphic>
	);
}
