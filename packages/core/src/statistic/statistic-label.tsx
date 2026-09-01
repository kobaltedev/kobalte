import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStatisticContext } from "./statistic-context";

export interface StatisticLabelOptions {}

export interface StatisticLabelCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface StatisticLabelRenderProps extends StatisticLabelCommonProps {}

export type StatisticLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StatisticLabelOptions & Partial<StatisticLabelCommonProps<ElementOf<T>>>;

/**
 * An accessible label describing the statistic, wired to `Statistic.Root`
 * via `aria-labelledby`.
 */
export function StatisticLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, StatisticLabelProps<T>>,
) {
	const context = useStatisticContext();

	const mergedProps = merge(
		{
			id: context.generateId("label"),
		},
		props as StatisticLabelProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerLabelId(id),
	);

	return (
		<Polymorphic<StatisticLabelRenderProps>
			as="span"
			id={mergedProps.id}
			{...others}
		/>
	);
}
