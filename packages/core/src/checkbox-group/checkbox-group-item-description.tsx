import { createEffect, onCleanup, type Component, type ValidComponent } from "solid-js";

import type {
	CheckboxDescriptionCommonProps,
	CheckboxDescriptionOptions,
	CheckboxDescriptionRenderProps,
} from "../checkbox";
import {
	FormControlDescription,
	type FormControlDescriptionRenderProps,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import {
	type CheckboxGroupItemDataSet,
	useCheckboxGroupItemContext,
} from "./checkbox-group-item-context";
import { mergeDefaultProps } from "@kobalte/utils";

export interface CheckboxGroupItemDescriptionOptions
	extends CheckboxDescriptionOptions {}

export interface CheckboxGroupItemDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> extends CheckboxDescriptionCommonProps {}

export interface CheckboxGroupItemDescriptionRenderProps
	extends CheckboxDescriptionRenderProps,
		CheckboxGroupItemDescriptionCommonProps,
		CheckboxGroupItemDataSet {}

export type CheckboxGroupItemDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = CheckboxGroupItemDescriptionOptions &
	Partial<CheckboxGroupItemDescriptionCommonProps<ElementOf<T>>>;

/**
 * The description that gives the user more information on the checkbox.
 */
export function CheckboxGroupItemDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, CheckboxGroupItemDescriptionProps<T>>,
) {
	const context = useCheckboxGroupItemContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as CheckboxGroupItemDescriptionProps,
	);

	createEffect(() => onCleanup(context.registerDescription(mergedProps.id)));

	return (
		<FormControlDescription<
			Component<
				Omit<
					CheckboxGroupItemDescriptionRenderProps,
					keyof FormControlDescriptionRenderProps
				>
			>
		>
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
