import type { ValidComponent } from "@solidjs/web";
import type { Component } from "solid-js";
import {
	FormControlLabel,
	type FormControlLabelCommonProps,
	type FormControlLabelOptions,
	type FormControlLabelRenderProps,
} from "../form-control/index.ts";
import type { ElementOf, PolymorphicProps } from "../polymorphic/index.tsx";
import { type SwitchDataSet, useSwitchContext } from "./switch-context.tsx";
import type { SwitchDescriptionCommonProps } from "./switch-description.tsx";

export interface SwitchLabelOptions extends FormControlLabelOptions {}

export interface SwitchLabelCommonProps<T extends HTMLElement = HTMLElement>
	extends FormControlLabelCommonProps<T> {}

export interface SwitchLabelRenderProps
	extends SwitchDescriptionCommonProps,
		FormControlLabelRenderProps,
		SwitchDataSet {}

export type SwitchLabelProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SwitchLabelOptions & Partial<SwitchLabelCommonProps<ElementOf<T>>>;

/**
 * The label that gives the user information on the switch.
 */
export function SwitchLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, SwitchLabelProps<T>>,
) {
	const context = useSwitchContext();

	return (
		<FormControlLabel<
			Component<Omit<SwitchLabelRenderProps, keyof FormControlLabelRenderProps>>
		>
			{...context.dataset()}
			{...(props as SwitchLabelProps)}
		/>
	);
}
