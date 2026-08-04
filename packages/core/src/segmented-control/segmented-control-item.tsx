import type { ValidComponent } from "@solidjs/web";
import { type Component, createEffect, createSignal, omit } from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import {
	RadioGroup,
	type RadioGroupItemCommonProps,
	type RadioGroupItemOptions,
	type RadioGroupItemRenderProps,
} from "../radio-group/index.tsx";
import { useRadioGroupContext } from "../radio-group/radio-group-context.tsx";
import { useSegmentedControlContext } from "./segmented-control-context.tsx";

export interface SegmentedControlItemOptions extends RadioGroupItemOptions {}

export interface SegmentedControlItemCommonProps<
	T extends HTMLElement = HTMLElement,
> extends RadioGroupItemCommonProps<T> {
	ref?: T | ((el: T) => void);
}

export interface SegmentedControlItemRenderProps
	extends RadioGroupItemRenderProps {}

export type SegmentedControlItemProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SegmentedControlItemOptions &
	Partial<SegmentedControlItemCommonProps<ElementOf<T>>>;

export const SegmentedControlItem = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SegmentedControlItemProps<T>>,
) => {
	const radioGroupContext = useRadioGroupContext();
	const segmentedControlContext = useSegmentedControlContext();

	const otherProps = omit(props, "ref");

	const [ref, setRef] = createSignal<HTMLElement>();

	createEffect(
		() => {
			const element = ref();
			return element && radioGroupContext.isSelectedValue(props.value)
				? element
				: undefined;
		},
		(element) => {
			if (element) segmentedControlContext.setSelectedItem(element);
		},
	);

	return (
		<RadioGroup.Item<
			Component<
				Omit<SegmentedControlItemRenderProps, keyof RadioGroupItemRenderProps>
			>
		>
			ref={[setRef, props.ref]}
			{...otherProps}
		/>
	);
};
