import {
	type DateDuration,
	endOfMonth,
	startOfWeek,
	today,
} from "@internationalized/date";
import {
	callHandler,
	mergeDefaultProps,
} from "@kobalte/utils";
import { type JSX, createMemo, splitProps, ValidComponent } from "solid-js";

import { createDateFormatter } from "../i18n";
import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
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


export interface CalendarGridCommonProps<T extends HTMLElement = HTMLElement> {
	onKeyDown: JSX.EventHandlerUnion<T, KeyboardEvent>;
	onFocusIn: JSX.EventHandlerUnion<T, FocusEvent>;
	onFocusOut: JSX.EventHandlerUnion<T, FocusEvent>;
	"aria-label": string;
}

export interface CalendarGridRenderProps
	extends CalendarGridCommonProps {
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
		{
			weekDayFormat: "short",
		},
		props as CalendarGridProps,
	);

	const [local, others] = splitProps(mergedProps, [
		"offset",
		"weekDayFormat",
		"onKeyDown",
		"onFocusIn",
		"onFocusOut",
		"aria-label",
	]);

	const startDate = createMemo(() => {
		if (local.offset) {
			return rootContext.startDate().add(local.offset);
		}

		return rootContext.startDate();
	});

	const endDate = createMemo(() => endOfMonth(startDate()));

	const dayFormatter = createDateFormatter(() => ({
		weekday: local.weekDayFormat,
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
		return [local["aria-label"], visibleRangeDescription()]
			.filter(Boolean)
			.join(", ");
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (
		e,
	) => {
		callHandler(e, local.onKeyDown);

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
		callHandler(e, local.onFocusIn);

		rootContext.setIsFocused(true);
	};

	const onFocusOut: JSX.FocusEventHandlerUnion<HTMLElement, FocusEvent> = (
		e,
	) => {
		callHandler(e, local.onFocusOut);

		rootContext.setIsFocused(false);
	};

	const context: CalendarGridContextValue = {
		startDate,
		weekDays,
	};

	return (
		<CalendarGridContext.Provider value={context}>
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
		</CalendarGridContext.Provider>
	);
}
