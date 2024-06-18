import type { Component, ValidComponent } from "solid-js";
import {
	FormControlErrorMessage,
	type FormControlErrorMessageCommonProps,
	type FormControlErrorMessageOptions,
	type FormControlErrorMessageRenderProps,
} from "../form-control";
import type { ElementOf, PolymorphicProps } from "../polymorphic";
import { type SwitchDataSet, useSwitchContext } from "./switch-context";

export interface SwitchErrorMessageOptions
	extends FormControlErrorMessageOptions {}

export interface SwitchErrorMessageCommonProps<
	T extends HTMLElement = HTMLElement,
> extends FormControlErrorMessageCommonProps<T> {}

export interface SwitchErrorMessageRenderProps
	extends SwitchErrorMessageCommonProps,
		FormControlErrorMessageRenderProps,
		SwitchDataSet {}

export type SwitchErrorMessageProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = SwitchErrorMessageOptions &
	Partial<SwitchErrorMessageCommonProps<ElementOf<T>>>;

/**
 * The error message that gives the user information about how to fix a validation error on the switch.
 */
export function SwitchErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, SwitchErrorMessageProps<T>>,
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
