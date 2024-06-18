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

export interface RadioGroupItemLabelOptions {}

export interface RadioGroupItemLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface RadioGroupItemLabelRenderProps
	extends RadioGroupItemLabelCommonProps,
		RadioGroupItemDataSet {
	for: string | undefined;
}

export type RadioGroupItemLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RadioGroupItemLabelOptions &
	Partial<RadioGroupItemLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the radio button.
 */
export function RadioGroupItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, RadioGroupItemLabelProps<T>>,
) {
	const context = useRadioGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as RadioGroupItemLabelProps,
	);

	createEffect(() => onCleanup(context.registerLabel(mergedProps.id!)));

	return (
		<Polymorphic<RadioGroupItemLabelRenderProps>
			as="label"
			for={context.inputId()}
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
