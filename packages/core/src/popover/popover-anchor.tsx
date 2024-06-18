import { mergeRefs } from "@kobalte/utils";
import { type ValidComponent, splitProps } from "solid-js";

import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";
import { type PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverAnchorOptions {}

export interface PopoverAnchorCommonProps<T extends HTMLElement = HTMLElement> {
	ref: T | ((el: T) => void);
}

export interface PopoverAnchorRenderProps
	extends PopoverAnchorCommonProps,
		PopoverDataSet {}

export type PopoverAnchorProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = PopoverAnchorOptions & Partial<PopoverAnchorCommonProps<ElementOf<T>>>;

/**
 * An optional element to position the `Popover.Content` against.
 * If this part is not used, the content will position alongside the `Popover.Trigger`.
 */
export function PopoverAnchor<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PopoverAnchorProps<T>>,
) {
	const context = usePopoverContext();

	const [local, others] = splitProps(props as PopoverAnchorProps, ["ref"]);

	return (
		<Polymorphic<PopoverAnchorRenderProps>
			as="div"
			ref={mergeRefs(context.setDefaultAnchorRef, local.ref)}
			{...context.dataset()}
			{...others}
		/>
	);
}
