import { type Accessor, Index, type JSX, splitProps, ValidComponent } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import { useCalendarGridContext } from "./calendar-grid-context";

export interface CalendarGridHeaderRowOptions {
	/**
	 * Render prop used to render each cell of the header row,
	 * it receives a week day accessor as parameter.
	 */
	children: (weekDay: Accessor<string>) => JSX.Element;
}

export interface CalendarGridHeaderRowCommonProps<T extends HTMLElement = HTMLElement> {
}

export interface CalendarGridHeaderRowRenderProps
	extends CalendarGridHeaderRowCommonProps {
		children: JSX.Element;
}

export type CalendarGridHeaderRowProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridHeaderRowOptions & Partial<CalendarGridHeaderRowCommonProps<ElementOf<T>>>;

/**
 * A calendar grid header row displays week day names inside a `Calendar.GridHeader`.
 */
export function CalendarGridHeaderRow<T extends ValidComponent = "tr">(
	props: PolymorphicProps<T, CalendarGridHeaderRowProps<T>>,
) {
	const [local, others] = splitProps(props as CalendarGridHeaderRowProps, ["children"]);

	const context = useCalendarGridContext();

	return (
		<Polymorphic<CalendarGridHeaderRowRenderProps> as="tr" {...others}>
			<Index each={context.weekDays()}>{local.children}</Index>
		</Polymorphic>
	);
}
