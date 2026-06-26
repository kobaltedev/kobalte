import {
	type AccordionContentCommonProps,
	type AccordionContentOptions,
	type AccordionContentProps,
	type AccordionContentRenderProps,
	AccordionContent as Content,
} from "./accordion-content";
import {
	type AccordionHeaderCommonProps,
	type AccordionHeaderOptions,
	type AccordionHeaderProps,
	type AccordionHeaderRenderProps,
	AccordionHeader as Header,
} from "./accordion-header";
import {
	type AccordionItemCommonProps,
	type AccordionItemOptions,
	type AccordionItemProps,
	type AccordionItemRenderProps,
	AccordionItem as Item,
} from "./accordion-item";
import {
	type AccordionRootCommonProps,
	type AccordionRootOptions,
	type AccordionRootProps,
	type AccordionRootRenderProps,
	AccordionRoot as Root,
} from "./accordion-root";
import {
	type AccordionTriggerCommonProps,
	type AccordionTriggerOptions,
	type AccordionTriggerProps,
	type AccordionTriggerRenderProps,
	AccordionTrigger as Trigger,
} from "./accordion-trigger";

export type {
	AccordionContentCommonProps,
	AccordionContentOptions,
	AccordionContentProps,
	AccordionContentRenderProps,
	AccordionHeaderCommonProps,
	AccordionHeaderOptions,
	AccordionHeaderProps,
	AccordionHeaderRenderProps,
	AccordionItemCommonProps,
	AccordionItemOptions,
	AccordionItemProps,
	AccordionItemRenderProps,
	AccordionRootCommonProps,
	AccordionRootOptions,
	AccordionRootProps,
	AccordionRootRenderProps,
	AccordionTriggerCommonProps,
	AccordionTriggerOptions,
	AccordionTriggerProps,
	AccordionTriggerRenderProps,
};
export { Content, Header, Item, Root, Trigger };

export const Accordion = Object.assign(Root, {
	Content,
	Header,
	Item,
	Trigger,
});

/**
 * API will most probably change
 */
export {
	type AccordionContextValue,
	useAccordionContext,
} from "./accordion-context";
