import { Component, ValidComponent } from "solid-js";
import {
	FormControlErrorMessage,
	FormControlErrorMessageCommonProps,
	FormControlErrorMessageOptions,
	FormControlErrorMessageRenderProps,
} from "../form-control";
import { PolymorphicProps } from "../polymorphic";
import { SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchErrorMessageOptions
	extends FormControlErrorMessageOptions {}

export interface SwitchErrorMessageCommonProps
	extends FormControlErrorMessageCommonProps {}

export interface SwitchErrorMessageRenderProps
	extends SwitchErrorMessageCommonProps,
		FormControlErrorMessageRenderProps,
		SwitchDataSet {}

export type SwitchErrorMessageProps = SwitchErrorMessageOptions &
	Partial<SwitchErrorMessageCommonProps>;

/**
 * The error message that gives the user information about how to fix a validation error on the switch.
 */
export function SwitchErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchErrorMessageProps>,
) {
	const context = useSwitchContext();

	return (
		<FormControlErrorMessage<
			Component<
				Omit<
					SwitchErrorMessageRenderProps,
					keyof FormControlErrorMessageRenderProps
				>
			>
		>
			{...context.dataset()}
			{...(props as SwitchErrorMessageProps)}
		/>
	);
}
