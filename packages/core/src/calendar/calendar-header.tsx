import type { ValidComponent } from "@solidjs/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface CalendarHeaderOptions {}

export interface CalendarHeaderCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface CalendarHeaderRenderProps extends CalendarHeaderCommonProps {}

export type CalendarHeaderProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarHeaderOptions & Partial<CalendarHeaderCommonProps<ElementOf<T>>>;

/**
 * Contains the calendar heading and navigation triggers.
 */
export function CalendarHeader<T extends ValidComponent = "header">(
	props: PolymorphicProps<T, CalendarHeaderProps<T>>,
) {
	return (
		<Polymorphic<CalendarHeaderRenderProps>
			as="header"
			{...(props as CalendarHeaderProps)}
		/>
	);
}
