import { mergeDefaultProps } from "@kobalte/utils";
import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type SelectDataSet, useSelectContext } from "./select-context";

export interface SelectIconOptions {}

export interface SelectIconCommonProps<T extends HTMLElement = HTMLElement> {
	children: JSX.Element;
}

export interface SelectIconRenderProps
	extends SelectIconCommonProps,
		SelectDataSet {
	"aria-hidden": "true";
}

export type SelectIconProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SelectIconOptions & Partial<SelectIconCommonProps<ElementOf<T>>>;

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon `children`.
 */
export function SelectIcon<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, SelectIconProps<T>>,
) {
	const context = useSelectContext();

	const mergedProps = mergeDefaultProps(
		{ children: "▼" },
		props as SelectIconProps,
	);

	return (
		<Polymorphic<SelectIconRenderProps>
			as="span"
			aria-hidden="true"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
