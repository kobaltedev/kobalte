import { mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import {
	RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemDescriptionOptions {}

export interface RadioGroupItemDescriptionCommonProps {
	id: string;
}

export interface RadioGroupItemDescriptionRenderProps
	extends RadioGroupItemDescriptionCommonProps,
		RadioGroupItemDataSet {}

export type RadioGroupItemDescriptionProps = RadioGroupItemDescriptionOptions &
	Partial<RadioGroupItemDescriptionCommonProps>;

/**
 * The description that gives the user more information on the radio button.
 */
export function RadioGroupItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioGroupItemDescriptionProps>,
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
