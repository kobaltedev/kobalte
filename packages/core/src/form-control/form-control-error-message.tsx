import { isServer, type ValidComponent } from "@solidjs/web";
import { createEffect, merge, omit, Show, untrack } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic/index.tsx";
import {
	type FormControlDataSet,
	useFormControlContext,
} from "./form-control-context.tsx";

export interface FormControlErrorMessageOptions {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface FormControlErrorMessageCommonProps<
	_T extends HTMLElement = HTMLElement,
> {
	id: string;
}

export interface FormControlErrorMessageRenderProps
	extends FormControlErrorMessageCommonProps,
		FormControlDataSet {
	role: "alert";
}

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

	const mergedProps = merge(
		{
			id: context.generateId("error-message"),
		},
		props as FormControlErrorMessageProps,
	);

	const others = omit(mergedProps, "forceMount");

	const isInvalid = () => context.validationState() === "invalid";

	// Register while rendering, so a field rendered after the error message can
	// read the id in the same pass. The effect keeps the registration in sync
	// when the id changes and unregisters it on unmount. Registration is a
	// signal write, so it stays client-side: on the server the association
	// falls back to the part's deterministic id (`${rootId}-error-message`).
	if (isInvalid() && !isServer)
		untrack(() => context.registerErrorMessage(others.id!));

	createEffect(
		() => (isInvalid() ? others.id! : undefined),
		(id) => {
			if (!id) return;
			return context.registerErrorMessage(id);
		},
	);

	return (
		<Show when={mergedProps.forceMount || isInvalid()}>
			<Polymorphic<FormControlErrorMessageRenderProps>
				as="div"
				// Errors are usually rendered after hydration, when the field has
				// already been read, so they need to be announced.
				role="alert"
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
