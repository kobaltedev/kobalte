import { mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverDescriptionOptions {}

export interface PopoverDescriptionCommonProps {
	id: string;
}

export interface PopoverDescriptionRenderProps
	extends PopoverDescriptionCommonProps,
		PopoverDataSet {}

export type PopoverDescriptionProps = PopoverDescriptionOptions &
	Partial<PopoverDescriptionCommonProps>;

/**
 * An optional accessible description to be announced when the popover is open.
 */
export function PopoverDescription<T extends ValidComponent = "p">(
	props: PolymorphicProps<T, PopoverDescriptionProps>,
) {
	const context = usePopoverContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("description"),
		},
		props as PopoverDescriptionProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerDescriptionId(local.id)));

	return (
		<Polymorphic<PopoverDescriptionRenderProps>
			as="p"
			id={local.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
