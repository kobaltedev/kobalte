import type { ValidComponent } from "@solidjs/web";
import { type Accessor, createMemo, For, type Element, omit } from "solid-js";

import { Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";
import type { DateValue } from "./types";

export interface CalendarGridBodyRowOptions {
	/** The index of the week to render. */
	weekIndex: number;

	/**
	 * Render prop used to render each cell of the week row,
	 * it receives a date accessor as parameter.
	 */
	children: (date: Accessor<DateValue | null>) => Element;
}

export type CalendarGridBodyRowProps<T extends ValidComponent = "tr"> =
	PolymorphicProps<T, CalendarGridBodyRowOptions>;

/**
 * A calendar grid body row displays a row of calendar cells within a month.
 */
export function CalendarGridBodyRow<T extends ValidComponent = "tr">(
	props: CalendarGridBodyRowProps<T>,
) {
	const rootContext = useCalendarContext();
	const context = useCalendarGridContext();
	const others = omit(props, "weekIndex", "children");

	const datesInWeek = createMemo(() => {
		return rootContext.getDatesInWeek(props.weekIndex, context.startDate());
	});

	return (
		<Polymorphic as="tr" {...(others as object)}>
			<For each={datesInWeek()} keyed={false}>
				{props.children}
			</For>
		</Polymorphic>
	);
}
