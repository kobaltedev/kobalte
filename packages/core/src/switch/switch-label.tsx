import { Component, ValidComponent } from "solid-js";
import {
	FormControlLabel,
	FormControlLabelCommonProps,
	FormControlLabelOptions,
	FormControlLabelRenderProps,
} from "../form-control";
import { PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";
import { SwitchDescriptionCommonProps } from "./switch-description";

export interface SwitchLabelOptions extends FormControlLabelOptions {}

export interface SwitchLabelCommonProps extends FormControlLabelCommonProps {}

export interface SwitchLabelRenderProps
	extends SwitchDescriptionCommonProps,
		FormControlLabelRenderProps,
		SwitchDataSet {}

export type SwitchLabelProps = SwitchLabelOptions &
	Partial<SwitchLabelCommonProps>;

/**
 * The label that gives the user information on the switch.
 */
export function SwitchLabel<T extends ValidComponent = "label">(
	props: PolymorphicProps<T, SwitchLabelProps>,
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
