import { mergeDefaultProps, mergeRefs } from "@kobalte/utils";
import { Show, type ValidComponent, createSignal, splitProps } from "solid-js";

import createPresence from "solid-presence";
import type {
	CheckboxIndicatorCommonProps,
	CheckboxIndicatorOptions,
	CheckboxIndicatorRenderProps,
} from "../checkbox";
import { useFormControlContext } from "../form-control";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type CheckboxGroupItemDataSet,
	useCheckboxGroupItemContext,
} from "./checkbox-group-item-context";

export interface CheckboxGroupItemIndicatorOptions
	extends CheckboxIndicatorOptions {}

export interface CheckboxGroupItemIndicatorCommonProps<
	T extends HTMLElement = HTMLElement,
> extends CheckboxIndicatorCommonProps {}

export interface CheckboxGroupItemIndicatorRenderProps
	extends CheckboxIndicatorRenderProps,
		CheckboxGroupItemIndicatorCommonProps,
		CheckboxGroupItemDataSet {}

export type CheckboxGroupItemIndicatorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxGroupItemIndicatorOptions &
	Partial<CheckboxGroupItemIndicatorCommonProps<ElementOf<T>>>;

/**
 * The visual indicator rendered when the checkbox item is in a checked or indeterminate state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function CheckboxGroupItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxGroupItemIndicatorProps<T>>,
) {
	const formControlContext = useFormControlContext();
	const context = useCheckboxGroupItemContext();

	const [ref, setRef] = createSignal<HTMLElement>();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props as CheckboxGroupItemIndicatorProps,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "forceMount"]);

	const { present } = createPresence({
		show: () =>
			local.forceMount || context.indeterminate() || context.checked(),
		element: () => ref() ?? null,
	});

	return (
		<Show when={present()}>
			<Polymorphic<CheckboxGroupItemIndicatorRenderProps>
				as="div"
				ref={mergeRefs(setRef, local.ref)}
				{...formControlContext.dataset()}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
