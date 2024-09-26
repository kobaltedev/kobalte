import type { ValidComponent } from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";

export interface CalendarGridHeaderOptions {
}

export interface CalendarGridHeaderCommonProps<T extends HTMLElement = HTMLElement> {
}

export interface CalendarGridHeaderRenderProps
	extends CalendarGridHeaderCommonProps {
		"aria-hidden": "true",
}

export type CalendarGridHeaderProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridHeaderOptions & Partial<CalendarGridHeaderCommonProps<ElementOf<T>>>;

/**
 * A calendar grid header displays a row of week day names at the top of a month.
 */
export function CalendarGridHeader<T extends ValidComponent = "thead">(
	props: PolymorphicProps<T, CalendarGridHeaderProps<T>>,
) {
	return <Polymorphic<CalendarGridHeaderRenderProps> as="thead" aria-hidden="true" {...props as CalendarGridHeaderProps} />;
}
