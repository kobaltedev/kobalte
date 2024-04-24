import { mergeRefs } from "@kobalte/utils";
import { ValidComponent, splitProps } from "solid-js";

import { Polymorphic, PolymorphicProps } from "../polymorphic";
import { PopoverDataSet, usePopoverContext } from "./popover-context";

export interface PopoverAnchorOptions {}

export interface PopoverAnchorCommonProps {
	ref: HTMLElement | ((el: HTMLElement) => void);
}

export interface PopoverAnchorRenderProps
	extends PopoverAnchorCommonProps,
		PopoverDataSet {}

export type PopoverAnchorProps = PopoverAnchorOptions &
	Partial<PopoverAnchorCommonProps>;

/**
 * An optional element to position the `Popover.Content` against.
 * If this part is not used, the content will position alongside the `Popover.Trigger`.
 */
export function PopoverAnchor<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, PopoverAnchorProps>,
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
