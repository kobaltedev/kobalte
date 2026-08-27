import { getWeeksInMonth } from "@internationalized/date";
import type { JSX, ValidComponent } from "@solidjs/web";
import { type Accessor, createMemo, For, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useCalendarContext } from "./calendar-context.tsx";
import { useCalendarGridContext } from "./calendar-grid-context.tsx";

export interface CalendarGridBodyOptions {
	/**
	 * Render prop used to render each row of the calendar grid,
	 * it receives a week index accessor as parameter.
	 */
	children: (weekIndex: Accessor<number>) => JSX.Element;
}

export interface CalendarGridBodyCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	children: JSX.Element;
}

export interface CalendarGridBodyRenderProps
	extends CalendarGridBodyCommonProps {}

export type CalendarGridBodyProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridBodyOptions &
	Partial<Omit<CalendarGridBodyCommonProps<ElementOf<T>>, "children">>;

/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export function CalendarGridBody<T extends ValidComponent = "tbody">(
	props: PolymorphicProps<T, CalendarGridBodyProps<T>>,
) {
	const rootContext = useCalendarContext();
	const context = useCalendarGridContext();

	const others = omit(props as CalendarGridBodyProps, "children");

	const weekIndexes = createMemo(() => {
		const weeksInMonth = getWeeksInMonth(
			context.startDate(),
			rootContext.locale(),
		);

		return [...new Array(weeksInMonth).keys()];
	});

	return (
		<Polymorphic<CalendarGridBodyRenderProps> as="tbody" {...others}>
			<For each={weekIndexes()} keyed={false}>
				{props.children}
			</For>
		</Polymorphic>
	);
}
