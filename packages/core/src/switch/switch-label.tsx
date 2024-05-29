import { Component, ValidComponent } from "solid-js";
import {
	FormControlLabel,
	FormControlLabelCommonProps,
	FormControlLabelOptions,
	FormControlLabelRenderProps,
} from "../form-control";
import { ElementOf, PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";
import { SwitchDescriptionCommonProps } from "./switch-description";

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
