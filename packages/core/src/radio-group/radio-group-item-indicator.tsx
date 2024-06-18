import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { Show, type ValidComponent, createSignal, splitProps } from "solid-js";

import createPresence from "solid-presence";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type RadioGroupItemDataSet,
	useRadioGroupItemContext,
} from "./radio-group-item-context";

export interface RadioGroupItemIndicatorOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface RadioGroupItemIndicatorCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
	ref: T | ((el: T) => void);
}

export interface RadioGroupItemIndicatorRenderProps
	extends RadioGroupItemIndicatorCommonProps,
		RadioGroupItemDataSet {}

export type RadioGroupItemIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = RadioGroupItemIndicatorOptions &
	Partial<RadioGroupItemIndicatorCommonProps<ElementOf<T>>>;

/**
 * The visual indicator rendered when the radio item is in a checked state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function RadioGroupItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RadioGroupItemIndicatorProps<T>>,
) {
	const context = useRadioGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props as RadioGroupItemIndicatorProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "forceMount"]);

	const [ref, setRef] = createSignal<HTMLElement>();

	const { present } = createPresence({
		show: () => local.forceMount || context.isSelected(),
		element: () => ref() ?? null,
	});

	return (
		<Show when={present()}>
			<Polymorphic<RadioGroupItemIndicatorRenderProps>
				as="div"
				ref={mergeRefs(setRef, local.ref)}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
