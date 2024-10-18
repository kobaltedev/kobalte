import {
	type Component,
	type ValidComponent,
	createEffect,
	onCleanup,
} from "solid-js";
import type { ElementOf, PolymorphicProps } from "../polymorphic";

import type {
	CheckboxLabelCommonProps,
	CheckboxLabelOptions,
	CheckboxLabelRenderProps,
} from "../checkbox";
import {
	FormControlLabel,
	type FormControlLabelRenderProps,
} from "../form-control";
import {
	type CheckboxGroupItemDataSet,
	useCheckboxGroupItemContext,
} from "./checkbox-group-item-context";

export interface CheckboxGroupItemLabelOptions extends CheckboxLabelOptions {}

export interface CheckboxGroupItemLabelCommonProps<
	T extends HTMLElement = HTMLElement,
> extends CheckboxLabelCommonProps {}

export interface CheckboxGroupItemLabelRenderProps
	extends CheckboxLabelRenderProps,
		CheckboxGroupItemLabelCommonProps,
		CheckboxGroupItemDataSet {}

export type CheckboxGroupItemLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxGroupItemLabelOptions &
	Partial<CheckboxGroupItemLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the checkbox.
 */
export function CheckboxGroupItemLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, CheckboxGroupItemLabelProps<T>>,
) {
	const context = useCheckboxGroupItemContext();

	return (
		<FormControlLabel<
			Component<
				Omit<
					CheckboxGroupItemLabelRenderProps,
					keyof FormControlLabelRenderProps
				>
			>
		>
			{...context.dataset()}
			{...(props as CheckboxGroupItemLabelProps)}
		/>
	);
}
