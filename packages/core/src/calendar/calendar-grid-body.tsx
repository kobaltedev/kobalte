import { getWeeksInMonth } from "@internationalized/date";
import {
	type Accessor,
	Index,
	type JSX,
	createMemo,
	splitProps,
} from "solid-js";

import { Polymorphic } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarGridBodyOptions {
	/**
	 * Render prop used to render each row of the calendar grid,
	 * it receives a week index accessor as parameter.
	 */
	children: (weekIndex: Accessor<number>) => JSX.Element;
}

export interface CalendarGridBodyCommonProps<T extends HTMLElement = HTMLElement> {
}

export interface CalendarGridBodyRenderProps
	extends CalendarGridBodyCommonProps {
		children: JSX.Element;
}

export type CalendarGridBodyProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridBodyOptions & Partial<CalendarGridBodyCommonProps<ElementOf<T>>>;

/**
 * A calendar grid body displays a grid of calendar cells within a month.
 */
export function CalendarGridBody<T extends ValidComponent = "tbody">(
	props: PolymorphicProps<T, CalendarGridBodyProps<T>>,
) {
	const rootContext = useCalendarContext();
	const context = useCalendarGridContext();

	const [local, others] = splitProps(props as CalendarGridBodyProps, ["children"]);

	const weekIndexes = createMemo(() => {
		const weeksInMonth = getWeeksInMonth(
			context.startDate(),
			rootContext.locale(),
		);

		return [...new Array(weeksInMonth).keys()];
	});

	return (
		<Polymorphic<CalendarGridBodyRenderProps> as="tbody" {...others}>
			<Index each={weekIndexes()}>{local.children}</Index>
		</Polymorphic>
	);
}
