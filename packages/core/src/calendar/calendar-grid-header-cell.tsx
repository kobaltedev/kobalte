/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarGrid.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/react-aria-components/src/Calendar.tsx
 */

import type { ValidComponent } from "@solidjs/web";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface CalendarGridHeaderCellOptions {}

export interface CalendarGridHeaderCellCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface CalendarGridHeaderCellRenderProps
	extends CalendarGridHeaderCellCommonProps {}

export type CalendarGridHeaderCellProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridHeaderCellOptions &
	Partial<CalendarGridHeaderCellCommonProps<ElementOf<T>>>;

/**
 * A calendar grid header cell displays a week day name at the top of a column within a calendar.
 */
export function CalendarGridHeaderCell<T extends ValidComponent = "th">(
	props: PolymorphicProps<T, CalendarGridHeaderCellProps<T>>,
) {
	return (
		<Polymorphic<CalendarGridHeaderCellRenderProps>
			as="th"
			{...(props as CalendarGridHeaderCellProps)}
		/>
	);
}
