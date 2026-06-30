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

export interface CalendarGridHeaderOptions {}

export interface CalendarGridHeaderCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface CalendarGridHeaderRenderProps
	extends CalendarGridHeaderCommonProps {
	"aria-hidden": "true";
}

export type CalendarGridHeaderProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridHeaderOptions &
	Partial<CalendarGridHeaderCommonProps<ElementOf<T>>>;

/**
 * A calendar grid header displays a row of week day names at the top of a month.
 */
export function CalendarGridHeader<T extends ValidComponent = "thead">(
	props: PolymorphicProps<T, CalendarGridHeaderProps<T>>,
) {
	return (
		<Polymorphic<CalendarGridHeaderRenderProps>
			as="thead"
			aria-hidden="true"
			{...(props as CalendarGridHeaderProps)}
		/>
	);
}
