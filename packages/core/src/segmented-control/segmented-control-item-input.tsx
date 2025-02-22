import { mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createSignal,
	splitProps,
} from "solid-js";

import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { createFormResetListener } from "../primitives";
import {
	RadioGroup,
	type RadioGroupItemInputCommonProps,
	type RadioGroupItemInputOptions,
	type RadioGroupItemInputRenderProps,
} from "../radio-group";
import { useRadioGroupItemContext } from "../radio-group/radio-group-item-context";

export interface SegmentedControlItemInputOptions
	extends RadioGroupItemInputOptions {}

export interface SegmentedControlItemInputCommonProps<
	T extends HTMLElement = HTMLInputElement,
> extends RadioGroupItemInputCommonProps<T> {}

export interface SegmentedControlItemInputRenderProps
	extends RadioGroupItemInputRenderProps {}

export type SegmentedControlItemInputProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SegmentedControlItemInputOptions &
	Partial<SegmentedControlItemInputCommonProps<ElementOf<T>>>;

export const SegmentedControlItemInput = <T extends ValidComponent = "input">(
	props: PolymorphicProps<T, SegmentedControlItemInputProps<T>>,
) => {
	const radioGroupItemContext = useRadioGroupItemContext();

	const [localProps, otherProps] = splitProps(props, ["ref"]);

	const [ref, setRef] = createSignal<HTMLInputElement>();

	createFormResetListener(ref, () => {
		requestAnimationFrame(() => {
			if (radioGroupItemContext.isDefault()) {
				radioGroupItemContext.select();
			}
		});
	});

	return (
		<RadioGroup.ItemInput<
			Component<
				Omit<
					SegmentedControlItemInputRenderProps,
					keyof RadioGroupItemInputRenderProps
				>
			>
		>
			ref={mergeRefs(setRef, localProps.ref)}
			{...otherProps}
		/>
	);
};
