import type { JSX, ValidComponent } from "@solidjs/web";
import { merge, omit, Show } from "solid-js";

import {
	type FormControlDataSet,
	useFormControlContext,
} from "../form-control/index.ts";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { useDatePickerContext } from "./date-picker-context.tsx";

export interface DatePickerValueOptions {
	/** Placeholder shown when no date, dates, or range has been selected yet. */
	children?: JSX.Element;
}

export interface DatePickerValueCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface DatePickerValueRenderProps
	extends DatePickerValueCommonProps,
		FormControlDataSet {
	children: JSX.Element;
	"data-placeholder-shown": string | undefined;
}

export type DatePickerValueProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = DatePickerValueOptions & Partial<DatePickerValueCommonProps<ElementOf<T>>>;

/**
 * Displays the formatted selected date, dates, or range, falling back to its
 * children as a placeholder when nothing is selected yet.
 */
export function DatePickerValue<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, DatePickerValueProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useDatePickerContext();

	const mergedProps = merge(
		{
			id: context.generateId("value"),
		},
		props as DatePickerValueProps,
	);

	const others = omit(mergedProps, "id", "children");

	const isEmpty = () => context.value() == null;

	return (
		<Polymorphic<DatePickerValueRenderProps>
			as="span"
			{...formControlContext.dataset()}
			{...others}
			id={mergedProps.id}
			data-placeholder-shown={isEmpty() ? "" : undefined}
		>
			<Show when={!isEmpty()} fallback={mergedProps.children}>
				{context.formattedValue()}
			</Show>
		</Polymorphic>
	);
}
