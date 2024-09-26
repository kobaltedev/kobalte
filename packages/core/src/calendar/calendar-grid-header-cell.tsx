import type { ValidComponent } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";

export interface CalendarGridHeaderCellOptions {
}

export interface CalendarGridHeaderCellCommonProps<T extends HTMLElement = HTMLElement> {
}

export interface CalendarGridHeaderCellRenderProps
	extends CalendarGridHeaderCellCommonProps {
}

export type CalendarGridHeaderCellProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridHeaderCellOptions & Partial<CalendarGridHeaderCellCommonProps<ElementOf<T>>>;

/**
 * A calendar grid header cell displays a week day name at the top of a column within a calendar.
 */
export function CalendarGridHeaderCell<T extends ValidComponent = "th">(
	props: PolymorphicProps<T, CalendarGridHeaderCellProps<T>>,
) {
	return <Polymorphic<CalendarGridHeaderCellRenderProps> as="th" {...props as CalendarGridHeaderCellProps} />;
}
