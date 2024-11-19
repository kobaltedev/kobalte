import { mergeRefs } from "@kobalte/utils";
import {
	type Component,
	type ValidComponent,
	createEffect,
	createSignal,
	onCleanup,
	splitProps,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	RadioGroup,
	type RadioGroupItemInputCommonProps,
	type RadioGroupItemInputOptions,
	type RadioGroupItemInputRenderProps,
} from "../radio-group";
import { useRadioGroupItemContext } from "../radio-group/radio-group-item-context";
import { useSegmentedControlContext } from "./segmented-control-context";

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
	const segmentedControlContext = useSegmentedControlContext();

	const [localProps, otherProps] = splitProps(props, ["ref"]);

	const [ref, setRef] = createSignal<HTMLInputElement>();

	createEffect(() => {
		const element = ref();
		if (!element) return;

		const form = element.form;
		if (!form) return;

		const handleReset = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();

			if (
				radioGroupItemContext.value() === segmentedControlContext.defaultValue()
			) {
				radioGroupItemContext.select();
			}
		};

		form.addEventListener("reset", handleReset);

		onCleanup(() => {
			form.removeEventListener("reset", handleReset);
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
