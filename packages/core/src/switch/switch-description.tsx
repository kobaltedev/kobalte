import { Component, ValidComponent } from "solid-js";
import {
	FormControlDescription,
	FormControlDescriptionCommonProps,
	FormControlDescriptionOptions,
	FormControlDescriptionRenderProps,
} from "../form-control";
import { PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchDescriptionOptions
	extends FormControlDescriptionOptions {}

export interface SwitchDescriptionCommonProps
	extends FormControlDescriptionCommonProps {}

export interface SwitchDescriptionRenderProps
	extends SwitchDescriptionCommonProps,
		FormControlDescriptionRenderProps,
		SwitchDataSet {}

export type SwitchDescriptionProps = SwitchDescriptionOptions &
	Partial<SwitchDescriptionCommonProps>;

/**
 * The description that gives the user more information on the switch.
 */
export function SwitchDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchDescriptionProps>,
) {
	const context = useSwitchContext();

	return (
		<FormControlDescription<
			Component<
				Omit<
					SwitchDescriptionRenderProps,
					keyof FormControlDescriptionRenderProps
				>
			>
		>
			{...context.dataset()}
			{...(props as SwitchDescriptionProps)}
		/>
	);
}
