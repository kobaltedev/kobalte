import { mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { ProgressDataSet, useProgressContext } from "./progress-context";

export interface ProgressLabelOptions {}

export interface ProgressLabelCommonProps {
	id: string;
}

export interface ProgressLabelRenderProps
	extends ProgressLabelCommonProps,
		ProgressDataSet {}

export type ProgressLabelProps = ProgressLabelOptions &
	Partial<ProgressLabelCommonProps>;

/**
 * An accessible label that gives the user information on the progress.
 */
export function ProgressLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ProgressLabelProps>,
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
