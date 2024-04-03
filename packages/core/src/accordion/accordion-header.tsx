import { OverrideComponentProps } from "@kobalte/utils";
import { ValidComponent } from "solid-js";

import {
	CollapsibleDataSet,
	useCollapsibleContext,
} from "../collapsible/collapsible-context";
import { Polymorphic, PolymorphicProps } from "../polymorphic";

export interface AccordionHeaderOptions {}

export interface AccordionHeaderCommonProps {}

export interface AccordionHeaderRenderProps
	extends AccordionHeaderCommonProps,
		CollapsibleDataSet {}

export type AccordionHeaderProps = AccordionHeaderOptions &
	Partial<AccordionHeaderCommonProps>;

/**
 * Wraps an `Accordion.Trigger`.
 * Use the `as` prop to update it to the appropriate heading level for your page.
 */
export function AccordionHeader<T extends ValidComponent = "h3">(
	props: PolymorphicProps<T, AccordionHeaderProps>,
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
