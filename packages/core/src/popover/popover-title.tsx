import { mergeDefaultProps } from "@kobalte/utils";
import { ValidComponent, createEffect, onCleanup, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverTitleOptions {}

export interface PopoverTitleCommonProps {
	id: string;
}

export interface PopoverTitleRenderProps
	extends PopoverTitleCommonProps,
		PopoverDataSet {}

export type PopoverTitleProps = PopoverTitleOptions &
	Partial<PopoverTitleCommonProps>;

/**
 * An accessible title to be announced when the popover is open.
 */
export function PopoverTitle<T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, PopoverTitleProps>,
) {
	const context = usePopoverContext();

	const mergedProps = mergeDefaultProps(
		{
			id: context.generateId("title"),
		},
		props as PopoverTitleProps,
	);

	const [local, others] = splitProps(mergedProps, ["id"]);

	createEffect(() => onCleanup(context.registerTitleId(local.id)));

	return (
		<Polymorphic<PopoverTitleRenderProps>
			as="h2"
			id={local.id}
			{...context.dataset()}
			{...others}
		/>
	);
}
