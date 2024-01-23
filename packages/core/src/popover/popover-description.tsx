import { OverrideComponentProps, mergeDefaultProps } from "@kobalte/utils";
import { createEffect, onCleanup, splitProps } from "solid-js";

import { AsChildProp, Polymorphic } from "../polymorphic";
import { usePopoverContext } from "./popover-context";

export interface PopoverDescriptionProps
	extends OverrideComponentProps<"p", AsChildProp> {}

/**
 * An optional accessible description to be announced when the popover is open.
 */
export function PopoverDescription(props: PopoverDescriptionProps) {
	const context = usePopoverContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerDescriptionId(local.id!)));

	return (
		<Polymorphic as="p" id={local.id} {...context.dataset()} {...others} />
	);
}
