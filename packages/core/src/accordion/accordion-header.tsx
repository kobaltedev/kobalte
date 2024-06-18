import { OverrideComponentProps } from "@kobalte/utils";
import type { ValidComponent } from "solid-js";

import {
	type CollapsibleDataSet,
	useCollapsibleContext,
} from "../collapsible/collapsible-context";
import {
	type ElementOf,
	Polymorphic,
	type PolymorphicProps,
} from "../polymorphic";

export interface AccordionHeaderOptions {}

export interface AccordionHeaderCommonProps<
	T extends HTMLElement = HTMLElement,
> {}

export interface AccordionHeaderRenderProps
	extends AccordionHeaderCommonProps,
		CollapsibleDataSet {}

export type AccordionHeaderProps<
	T extends ValidComponent | HTMLElement = HTMLElement,
> = AccordionHeaderOptions & Partial<AccordionHeaderCommonProps<ElementOf<T>>>;

/**
 * Wraps an `Accordion.Trigger`.
 * Use the `as` prop to update it to the appropriate heading level for your page.
 */
export function AccordionHeader<T extends ValidComponent = "h3">(
	props: PolymorphicProps<T, AccordionHeaderProps<T>>,
) {
	// `Accordion.Item` is a `Collapsible.Root`.
	const context = useCollapsibleContext();

	return (
		<Polymorphic<AccordionHeaderRenderProps>
			as="h3"
			{...context.dataset()}
			{...props}
		/>
	);
}
