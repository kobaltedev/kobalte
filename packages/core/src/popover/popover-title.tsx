import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import { type PopoverDataSet, usePopoverContext } from "./popover-context.tsx";

export interface PopoverTitleOptions {}

export interface PopoverTitleCommonProps<_T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface PopoverTitleRenderProps
	extends PopoverTitleCommonProps,
		PopoverDataSet {}

export type PopoverTitleProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PopoverTitleOptions & Partial<PopoverTitleCommonProps<ElementOf<T>>>;

/**
 * An accessible title to be announced when the popover is open.
 */
export function PopoverTitle<T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, PopoverTitleProps<T>>,
) {
	const context = usePopoverContext();

	const mergedProps = merge(
		{
			id: context.generateId("title"),
		},
		props as PopoverTitleProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerTitleId(id),
	);

	return (
		<Polymorphic<PopoverTitleRenderProps>
			as="h2"
			id={mergedProps.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
