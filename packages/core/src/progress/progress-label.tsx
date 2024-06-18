import { mergeDefaultProps } from "@kobalte/utils";
import {
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressLabelOptions {}

export interface ProgressLabelCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface ProgressLabelRenderProps
	extends ProgressLabelCommonProps,
		ProgressDataSet {}

export type ProgressLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ProgressLabelOptions & Partial<ProgressLabelCommonProps<ElementOf<T>>>;

/**
 * An accessible label that gives the user information on the progress.
 */
export function ProgressLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ProgressLabelProps<T>>,
) {
	const context = useProgressContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as ProgressLabelProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerLabelId(local.id)));

	return (
		<Polymorphic<ProgressLabelRenderProps>
			as="span"
			id={local.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
