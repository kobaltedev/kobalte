import { mergeRefs } from "@kobalte/utils";
import {
	type ValidComponent,
	createEffect,
	createSignal,
	merge,
	omit,
} from "solid-js";
import type { PolymorphicProps } from "../polymorphic";
import { RadioGroup, type RadioGroupRootProps } from "../radio-group";
import {
	SegmentedControlContext,
	type SegmentedControlContextValue,
} from "./segmented-control-context";

export type SegmentedControlRootProps = RadioGroupRootProps;

export const SegmentedControlRoot = <T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SegmentedControlRootProps>,
) => {
	const mergedProps = merge(
		{
			defaultValue: props.value,
			orientation: "horizontal",
		},
		props,
	);

	const otherProps = omit(mergedProps, "ref");

	const [ref, setRef] = createSignal<HTMLElement>();
	const [selectedItem, setSelectedItem] = createSignal<HTMLElement>();

	const context: SegmentedControlContextValue = {
		value: () => otherProps.value,
		defaultValue: () => otherProps.defaultValue,
		orientation: () => otherProps.orientation,
		root: ref,
		selectedItem: selectedItem,
		setSelectedItem: setSelectedItem,
	};

	createEffect(() => {
		if (context.value()) return;

		setSelectedItem(undefined);
	});

	return (
		<SegmentedControlContext value={context}>
			<RadioGroup ref={mergeRefs(setRef, mergedProps.ref)} {...otherProps} />
		</SegmentedControlContext>
	);
};
