import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { Show, ValidComponent, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { createPresence } from "../primitives";
import {
	RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemIndicatorOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface RadioGroupItemIndicatorCommonProps {
	id: string;
	ref: HTMLElement | ((el: HTMLElement) => void);
}

export interface RadioGroupItemIndicatorRenderProps
	extends RadioGroupItemIndicatorCommonProps,
		RadioGroupItemDataSet {}

export type RadioGroupItemIndicatorProps = RadioGroupItemIndicatorOptions &
	Partial<RadioGroupItemIndicatorCommonProps>;

/**
 * The visual indicator rendered when the radio item is in a checked state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function RadioGroupItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioGroupItemIndicatorProps>,
) {
	const context = useRadioGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props as RadioGroupItemIndicatorProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "forceMount"]);

	const presence = createPresence(
		() => local.forceMount || context.isSelected(),
	);

	return (
		<Show when={presence.isPresent()}>
			<Polymorphic<RadioGroupItemIndicatorRenderProps>
				as="div"
				ref={mergeRefs(presence.setRef, local.ref)}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
