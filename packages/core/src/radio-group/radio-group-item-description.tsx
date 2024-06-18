import { mergeDefaultProps } from "@kobalte/utils";
import { type ValidComponent, createEffect, onCleanup } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemDescriptionOptions {}

export interface RadioGroupItemDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
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

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as RadioGroupItemDescriptionProps,
	);

	createEffect(() => onCleanup(context.registerDescription(mergedProps.id)));

	return (
		<Polymorphic<RadioGroupItemDescriptionRenderProps>
			as="div"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
