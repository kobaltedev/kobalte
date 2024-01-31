import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { useFormControlContext } from "./form-control-context";

export interface FormControlDescriptionProps
	extends OverrideComponentProps<"div", AsChildProp> {}

/**
 * The description that gives the user more information on the form control.
 */
export function FormControlDescription(props: FormControlDescriptionProps) {
	const context = useFormControlContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props,
	);

	createEffect(() => onCleanup(context.registerDescription(mergedProps.id!)));

	return <Polymorphic as="div" {...context.dataset()} {...mergedProps} />;
}
