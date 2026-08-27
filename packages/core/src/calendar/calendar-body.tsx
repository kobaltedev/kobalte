import type { ValidComponent } from "@solidjs/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";

export interface CalendarBodyOptions {}

export interface CalendarBodyCommonProps<
	_T extends HTMLElement = HTMLElement,
> {}

export interface CalendarBodyRenderProps extends CalendarBodyCommonProps {}

export type CalendarBodyProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarBodyOptions & Partial<CalendarBodyCommonProps<ElementOf<T>>>;

/**
 * Contains the calendar grids.
 */
export function CalendarBody<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CalendarBodyProps<T>>,
) {
	return (
		<Polymorphic<CalendarBodyRenderProps>
			as="div"
			{...(props as CalendarBodyProps)}
		/>
	);
}
