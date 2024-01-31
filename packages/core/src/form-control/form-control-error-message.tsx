import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { Show, createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";

export interface FormControlErrorMessageOptions extends AsChildProp {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface FormControlErrorMessageProps
	extends OverrideComponentProps<"div", FormControlErrorMessageOptions> {}

/**
 * The error message that gives the user information about how to fix a validation error on the form control.
 */
export function FormControlErrorMessage(props: FormControlErrorMessageProps) {
	const context = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("error-message"),
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["forceMount"]);

	const isInvalid = () => context.validationState() === "invalid";

	createEffect(() => {
		if (!isInvalid()) {
			return;
		}

		onCleanup(context.registerErrorMessage(others.id!));
	});

	return (
		<Show when={local.forceMount || isInvalid()}>
			<Polymorphic as="div" {...context.dataset()} {...others} />
		</Show>
	);
}
