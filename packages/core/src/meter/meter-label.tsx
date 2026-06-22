import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import {
	createEffect,
	omit,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type MeterDataSet, useMeterContext } from "./meter-context";

export interface MeterLabelOptions {}

export interface MeterLabelCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface MeterLabelRenderProps
	extends MeterLabelCommonProps,
		MeterDataSet {}

export type MeterLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = MeterLabelOptions & Partial<MeterLabelCommonProps<ElementOf<T>>>;

/**
 * An accessible label that gives the user information on the meter.
 */
export function MeterLabel<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, MeterLabelProps<T>>,
) {
	const context = useMeterContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("label"),
		},
		props as MeterLabelProps,
	);

	const others = omit(mergedProps, "id");

	createEffect(() => mergedProps.id, (id) => context.registerLabelId(id));

	return (
		<Polymorphic<MeterLabelRenderProps>
			as="span"
			id={mergedProps.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
