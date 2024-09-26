import type { OverrideComponentProps } from "@kobalte/utils";
import {
	type Accessor,
	Index,
	type JSX,
	createMemo,
	splitProps,
    ValidComponent,
} from "solid-js";

import { ElementOf, Polymorphic, PolymorphicProps } from "../polymorphic";
import { useCalendarContext } from "./calendar-context";
import { useCalendarGridContext } from "./calendar-grid-context";
import type { DateValue } from "./types";

export interface CalendarGridBodyRowOptions {
	/** The index of the week to render. */
	weekIndex: number;

	/**
	 * Render prop used to render each cell of the week row,
	 * it receives a date accessor as parameter.
	 */
	children: (date: Accessor<DateValue | null>) => JSX.Element;
}

export interface CalendarGridBodyRowCommonProps<T extends HTMLElement = HTMLElement> {
}

export interface CalendarGridBodyRowRenderProps
	extends CalendarGridBodyRowCommonProps {
		children: JSX.Element;
}

export type CalendarGridBodyRowProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CalendarGridBodyRowOptions & Partial<CalendarGridBodyRowCommonProps<ElementOf<T>>>;

/**
 * A calendar grid body row displays a row of calendar cells within a month.
 */
export function CalendarGridBodyRow<T extends ValidComponent = "tr">(
	props: PolymorphicProps<T, CalendarGridBodyRowProps<T>>,
) {
	const rootContext = useCalendarContext();
	const context = useCalendarGridContext();

	const [local, others] = splitProps(props as CalendarGridBodyRowProps, ["weekIndex", "children"]);

	const datesInWeek = createMemo(() => {
		return rootContext.getDatesInWeek(local.weekIndex, context.startDate());
	});

	return (
		<Polymorphic<CalendarGridBodyRowRenderProps> as="tr" {...others}>
			<Index each={datesInWeek()}>{local.children}</Index>
		</Polymorphic>
	);
}
