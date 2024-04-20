import { mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup } from "solid-js";
import { Polymorphic, PolymorphicProps } from "../polymorphic";

import {
	RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemLabelOptions {}

export interface RadioGroupItemLabelCommonProps {
	id: string;
}

export interface RadioGroupItemLabelRenderProps
	extends RadioGroupItemLabelCommonProps,
		RadioGroupItemDataSet {
	for: string | undefined;
}

export type RadioGroupItemLabelProps = RadioGroupItemLabelOptions &
	Partial<RadioGroupItemLabelCommonProps>;

/**
 * The label that gives the user information on the radio button.
 */
export function RadioGroupItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, RadioGroupItemLabelProps>,
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
