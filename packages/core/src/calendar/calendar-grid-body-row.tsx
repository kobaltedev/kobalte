import type { JSX, ValidComponent } from "@solidjs/web";
import { type Accessor, createMemo, For, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useCalendarContext } from "./calendar-context.tsx";
import { useCalendarGridContext } from "./calendar-grid-context.tsx";
import type { DateValue } from "./types.ts";

export interface CalendarGridBodyRowOptions {
	/** The index of the week to render. */
	weekIndex: number;

	/**
	 * Render prop used to render each cell of the week row,
	 * it receives a date accessor as parameter.
	 */
	children: (date: Accessor<DateValue | null>) => JSX.Element;
}

export interface CalendarGridBodyRowCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	children: JSX.Element;
}

export interface CalendarGridBodyRowRenderProps
	extends CalendarGridBodyRowCommonProps {}

export type CalendarGridBodyRowProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridBodyRowOptions &
	Partial<Omit<CalendarGridBodyRowCommonProps<ElementOf<T>>, "children">>;

/**
 * A calendar grid body row displays a row of calendar cells within a month.
 */
export function CalendarGridBodyRow<T extends ValidComponent = "tr">(
	props: PolymorphicProps<T, CalendarGridBodyRowProps<T>>,
) {
	const rootContext = useCalendarContext();
	const context = useCalendarGridContext();

	const others = omit(
		props as CalendarGridBodyRowProps,
		"weekIndex",
		"children",
	);

	const datesInWeek = createMemo(() => {
		return rootContext.getDatesInWeek(props.weekIndex, context.startDate());
	});

	return (
		<Polymorphic<CalendarGridBodyRowRenderProps> as="tr" {...others}>
			<For each={datesInWeek()} keyed={false}>
				{props.children}
			</For>
		</Polymorphic>
	);
}
