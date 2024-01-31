import {
	OverrideComponentProps,
	mergeDefaultProps,
	mergeRefs,
} from "@kobalte/utils";
import { Show, splitProps } from "solid-js";

import { useFormControlContext } from "../form-control";
import { AsChildProp, Polymorphic } from "../polymorphic";
import { createPresence } from "../primitives";
import { useCheckboxContext } from "./checkbox-context";

export interface CheckboxIndicatorOptions extends AsChildProp {
	/**
	 * Used to force mounting when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount?: boolean;
}

export interface CheckboxIndicatorProps
	extends OverrideComponentProps<"div", CheckboxIndicatorOptions> {}

/**
 * The visual indicator rendered when the checkbox is in a checked or indeterminate state.
 * You can style this element directly, or you can use it as a wrapper to put an icon into, or both.
 */
export function CheckboxIndicator(props: CheckboxIndicatorProps) {
	const formControlContext = useFormControlContext();
	const context = useCheckboxContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("indicator"),
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["ref", "forceMount"]);

	const presence = createPresence(
		() => local.forceMount || context.indeterminate() || context.checked(),
	);

	return (
		<Show when={presence.isPresent()}>
			<Polymorphic
				as="div"
				ref={mergeRefs(presence.setRef, local.ref)}
				{...formControlContext.dataset()}
				{...context.dataset()}
				{...others}
			/>
		</Show>
	);
}
