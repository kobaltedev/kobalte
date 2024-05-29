import { Component, ValidComponent } from "solid-js";
import {
	FormControlDescription,
	FormControlDescriptionCommonProps,
	FormControlDescriptionOptions,
	FormControlDescriptionRenderProps,
} from "../form-control";
import { ElementOf, PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchDescriptionOptions
	extends FormControlDescriptionOptions {}

export interface SwitchDescriptionCommonProps<
	T extends HTMLElement = HTMLElement,
> extends FormControlDescriptionCommonProps<T> {}

export interface SwitchDescriptionRenderProps
	extends SwitchDescriptionCommonProps,
		FormControlDescriptionRenderProps,
		SwitchDataSet {}

export type SwitchDescriptionProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SwitchDescriptionOptions &
	Partial<SwitchDescriptionCommonProps<ElementOf<T>>>;

/**
 * The description that gives the user more information on the switch.
 */
export function SwitchDescription<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchDescriptionProps<T>>,
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
