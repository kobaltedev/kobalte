import { mergeDefaultProps } from "@kobalte/utils";
import { ComponentProps, createEffect, onCleanup } from "solid-js";

import { useRadioGroupItemContext } from "./radio-group-item-context";

export interface RadioGroupItemLabelProps extends ComponentProps<"label"> {}

/**
 * The label that gives the user information on the radio button.
 */
export function RadioGroupItemLabel(props: RadioGroupItemLabelProps) {
	const context = useRadioGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props,
	);

	createEffect(() => onCleanup(context.registerLabel(mergedProps.id!)));

	return (
		<label for={context.inputId()} {...context.dataset()} {...mergedProps} />
	);
}
