import { createGenerateId, mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createSignal, createUniqueId, omit } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { createRegisterId } from "../primitives";
import {
	StatisticContext,
	type StatisticContextValue,
} from "./statistic-context";

export interface StatisticRootOptions {
	/**
	 * A unique identifier for the component.
	 * The id is used to generate id attributes for nested components.
	 * If no id prop is provided, a generated id will be used.
	 */
	id?: string;
}

export interface StatisticRootCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface StatisticRootRenderProps extends StatisticRootCommonProps {
	"aria-labelledby": string | undefined;
	"aria-describedby": string | undefined;
}

export type StatisticRootProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = StatisticRootOptions & Partial<StatisticRootCommonProps<ElementOf<T>>>;

/**
 * Displays a labeled numeric value, such as a KPI or dashboard metric.
 */
export function StatisticRoot<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, StatisticRootProps<T>>,
) {
	const defaultId = `statistic-${createUniqueId()}`;

	const mergedProps = mergeDefaultProps(
		{
			id: defaultId,
		},
		props as StatisticRootProps,
	);

	const [labelId, setLabelId] = createSignal<string | undefined>(undefined, {
		ownedWrite: true,
	});
	const [descriptionId, setDescriptionId] = createSignal<string | undefined>(
		undefined,
		{ ownedWrite: true },
	);

	const others = omit(mergedProps, "id");

	const context: StatisticContextValue = {
		generateId: createGenerateId(() => mergedProps.id!),
		registerLabelId: createRegisterId(setLabelId),
		registerDescriptionId: createRegisterId(setDescriptionId),
	};

	return (
		<StatisticContext value={context}>
			<Polymorphic<StatisticRootRenderProps>
				as="div"
				id={mergedProps.id}
				aria-labelledby={labelId()}
				aria-describedby={descriptionId()}
				{...others}
			/>
		</StatisticContext>
	);
}
