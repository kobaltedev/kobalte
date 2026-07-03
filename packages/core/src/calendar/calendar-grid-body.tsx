import { getWeeksInMonth } from "@internationalized/date";
import type { ValidComponent } from "@solidjs/web";
import { type Accessor, createMemo, For, type Element, omit } from "solid-js";

import { Polymorphic, type PolymorphicProps } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarGridBodyOptions {
	/**
	 * Render prop used to render each row of the calendar grid,
	 * it receives a week index accessor as parameter.
	 */
	children: (weekIndex: Accessor<number>) => Element;
}

export type CalendarGridBodyProps<T extends ValidComponent = "tbody"> =
	PolymorphicProps<T, CalendarGridBodyOptions>;

/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export function CalendarGridBody<T extends ValidComponent = "tbody">(
	props: CalendarGridBodyProps<T>,
) {
	const rootContext = useCalendarContext();
	const context = useCalendarGridContext();
	const others = omit(props, "children");

	const weekIndexes = createMemo(() => {
		const weeksInMonth = getWeeksInMonth(
			context.startDate(),
			rootContext.locale(),
		);

		return [...new Array(weeksInMonth).keys()];
	});

	return (
		<Polymorphic as="tbody" {...(others as object)}>
			<For each={weekIndexes()} keyed={false}>
				{props.children}
			</For>
		</Polymorphic>
	);
}
