import { mergeRefs } from "@kobalte/utils";
import { type ValidComponent } from "@solidjs/web";
import {
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

	createEffect(
		() => context.value(),
		(value, prev) => {
			// Only clear the visual selection when a controlled value transitions to nothing.
			// Skipping the first run (prev === undefined) prevents racing with item effects
			// that establish the initial selection from defaultValue.
			if (prev !== undefined && !value) setSelectedItem(undefined);
		},
	);

	return (
		<SegmentedControlContext value={context}>
			<RadioGroup ref={mergeRefs(setRef, mergedProps.ref)} {...otherProps} />
		</SegmentedControlContext>
	);
};
