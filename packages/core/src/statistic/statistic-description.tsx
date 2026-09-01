import type { ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { useStatisticContext } from "./statistic-context";

export interface StatisticDescriptionOptions {}

export interface StatisticDescriptionCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface StatisticDescriptionRenderProps
	extends StatisticDescriptionCommonProps {}

export type StatisticDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StatisticDescriptionOptions &
	Partial<StatisticDescriptionCommonProps<ElementOf<T>>>;

/**
 * Optional supplementary text for the statistic (e.g. a breakdown like
 * "12 high, 28 low"), wired to `Statistic.Root` via `aria-describedby`.
 */
export function StatisticDescription<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, StatisticDescriptionProps<T>>,
) {
	const context = useStatisticContext();

	const mergedProps = merge(
		{
			id: context.generateId("description"),
		},
		props as StatisticDescriptionProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(
		() => mergedProps.id,
		(id) => context.registerDescriptionId(id!),
	);

	return (
		<Polymorphic<StatisticDescriptionRenderProps>
			as="span"
			id={mergedProps.id}
			{...others}
		/>
	);
}
