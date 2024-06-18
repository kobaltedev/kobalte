import { mergeDefaultProps } from "@kobalte/utils";
import {
	type ValidComponent,
	createEffect,
	onCleanup,
	splitProps,
} from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverTitleOptions {}

export interface PopoverTitleCommonProps<T extends HTMLElement = HTMLElement> {
	id: string;
}

export interface PopoverTitleRenderProps
	extends PopoverTitleCommonProps,
		PopoverDataSet {}

export type PopoverTitleProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PopoverTitleOptions & Partial<PopoverTitleCommonProps<ElementOf<T>>>;

/**
 * An accessible title to be announced when the popover is open.
 */
export function PopoverTitle<T extends ValidComponent = "h2">(
	props: PolymorphicProps<T, PopoverTitleProps<T>>,
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
