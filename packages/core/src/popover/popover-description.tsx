import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createEffect, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverDescriptionOptions {}

export interface PopoverDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface PopoverDescriptionRenderProps
	extends PopoverDescriptionCommonProps,
		PopoverDataSet {}

export type PopoverDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PopoverDescriptionOptions &
	Partial<PopoverDescriptionCommonProps<ElementOf<T>>>;

/**
 * An optional accessible description to be announced when the popover is open.
 */
export function PopoverDescription<T extends ValidComponent = "p">(
	props: PolymorphicProps<T, PopoverDescriptionProps<T>>,
) {
	const context = usePopoverContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as PopoverDescriptionProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerDescriptionId(id),
	);

	return (
		<Polymorphic<PopoverDescriptionRenderProps>
			as="p"
			id={mergedProps.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
