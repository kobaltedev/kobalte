/*
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-stately/calendar/src/useCalendarState.ts
 * https://github.com/adobe/react-spectrum/blob/0a1d0cd4e1b2f77eed7c0ea08fce8a04f8de6921/packages/@react-aria/calendar/src/useCalendarBase.ts
 */

import type { ValidComponent } from "@solidjs/web";
import { createMemo } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { getVisibleRangeDescription } from "./utils";

export interface CalendarHeadingOptions {}

export interface CalendarHeadingCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface CalendarHeadingRenderProps extends CalendarHeadingCommonProps {
	children: string;
}

export type CalendarHeadingProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarHeadingOptions &
	Partial<CalendarHeadingCommonProps<ElementOf<T>>>;

export function CalendarHeading<T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, CalendarHeadingProps<T>>,
) {
	const rootContext = useCalendarContext();

	const title = createMemo(() => {
		return getVisibleRangeDescription(
			rootContext.translations(),
			rootContext.startDate(),
			rootContext.endDate(),
			rootContext.timeZone(),
			false,
		);
	});

	return (
		<Polymorphic<CalendarHeadingRenderProps>
			as="h2"
			{...(props as CalendarHeadingProps)}
		>
			{title()}
		</Polymorphic>
	);
}
