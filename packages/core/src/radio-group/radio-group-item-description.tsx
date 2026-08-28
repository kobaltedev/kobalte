import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	type RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context.tsx";

export interface RadioGroupItemDescriptionOptions {}

export interface RadioGroupItemDescriptionCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface RadioGroupItemDescriptionRenderProps
	extends RadioGroupItemDescriptionCommonProps,
		RadioGroupItemDataSet {}

export type RadioGroupItemDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RadioGroupItemDescriptionOptions &
	Partial<RadioGroupItemDescriptionCommonProps<ElementOf<T>>>;

/**
 * The description that gives the user more information on the radio button.
 */
export function RadioGroupItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioGroupItemDescriptionProps<T>>,
) {
	const context = useRadioGroupItemContext();

	const mergedProps = merge(
		{
			id: context.generateId("description"),
		},
		props as RadioGroupItemDescriptionProps,
	);

	createEffect(
		() => mergedProps.id,
		(id) => context.registerDescription(id),
	);

	return (
		<Polymorphic<RadioGroupItemDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
