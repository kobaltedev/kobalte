import { mergeRefs } from "@kobalte/utils";
import {
	type ValidComponent,
	createSignal,
	mergeProps,
	splitProps,
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
	const mergedProps = mergeProps(
		{
			orientation: "horizontal",
		},
		props,
	);

	const [localProps, otherProps] = splitProps(mergedProps, ["ref"]);

	const [ref, setRef] = createSignal<HTMLElement>();
	const [selectedItem, setSelectedItem] = createSignal<HTMLElement>();

	const context: SegmentedControlContextValue = {
		orientation: () => otherProps.orientation,
		root: ref,
		selectedItem: selectedItem,
		setSelectedItem: setSelectedItem,
	};

	return (
		<SegmentedControlContext.Provider value={context}>
			<RadioGroup ref={mergeRefs(setRef, localProps.ref)} {...otherProps} />
		</SegmentedControlContext.Provider>
	);
};
