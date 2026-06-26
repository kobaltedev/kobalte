import { mergeDefaultProps } from "@kobalte/utils";
import type { ValidComponent } from "@solidjs/web";
import { createEffect, omit, onCleanup, Show } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "./form-control-context";

export interface FormControlErrorMessageOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface FormControlErrorMessageCommonProps<
	T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface FormControlErrorMessageRenderProps
	extends FormControlErrorMessageCommonProps,
		FormControlDataSet {}

export type FormControlErrorMessageProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = FormControlErrorMessageOptions &
	Partial<FormControlErrorMessageCommonProps<ElementOf<T>>>;

/**
 * The error message that gives the user information about how to fix a validation error on the form control.
 */
export function FormControlErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, FormControlErrorMessageProps<T>>,
) {
	const context = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("error-message"),
		},
		props as FormControlErrorMessageProps,
	);

	const others = omit(mergedProps, "forceMount");

	const isInvalid = () => context.validationState() === "invalid";

	createEffect(
		() => (isInvalid() ? others.id! : undefined),
		(id) => {
			if (!id) return;
			onCleanup(context.registerErrorMessage(id));
		},
	);

	return (
		<Show when={mergedProps.forceMount || isInvalid()}>
			<Polymorphic<FormControlErrorMessageRenderProps>
				as="div"
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
