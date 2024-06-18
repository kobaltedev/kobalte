import { mergeDefaultProps } from "@kobalte/utils";
import type { JSX, ValidComponent } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type ComboboxDataSet, useComboboxContext } from "./combobox-context";

export interface ComboboxIconOptions {}

export interface ComboboxIconCommonProps<T extends HTMLElement = HTMLElement> {
	children: JSX.Element;
}

export interface ComboboxIconRenderProps
	extends ComboboxIconCommonProps,
		ComboboxDataSet {
	"aria-hidden": "true";
}

export type ComboboxIconProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = ComboboxIconOptions & Partial<ComboboxIconCommonProps<ElementOf<T>>>;

/**
 * A small icon often displayed next to the value as a visual affordance for the fact it can be open.
 * It renders a `▼` by default, but you can use your own icon `children`.
 */
export function ComboboxIcon<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ComboboxIconProps<T>>,
) {
	const context = useComboboxContext();

	const mergedProps = mergeDefaultProps(
		{ children: "▼" },
		props as ComboboxIconProps,
	);

	return (
		<Polymorphic
			as="span"
			aria-hidden="true"
			{...context.dataset()}
			{...mergedProps}
		/>
	);
}
