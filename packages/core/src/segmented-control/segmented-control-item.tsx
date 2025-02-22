import { mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createEffect,
	createSignal,
	splitProps,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	RadioGroup,
	type RadioGroupItemCommonProps,
	type RadioGroupItemOptions,
	type RadioGroupItemRenderProps,
} from "../radio-group";
import { useRadioGroupContext } from "../radio-group/radio-group-context";
import { useSegmentedControlContext } from "./segmented-control-context";

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

	const [localProps, otherProps] = splitProps(props, ["ref"]);

	const [ref, setRef] = createSignal<HTMLElement>();

	createEffect(() => {
		const element = ref();
		if (!element) return;

		if (radioGroupContext.isSelectedValue(props.value)) {
			segmentedControlContext.setSelectedItem(element);
		}
	});

	return (
		<RadioGroup.Item<
			Component<
				Omit<SegmentedControlItemRenderProps, keyof RadioGroupItemRenderProps>
			>
		>
			ref={mergeRefs(setRef, localProps.ref)}
			{...otherProps}
		/>
	);
};
