import {
	type CollapsibleContentCommonProps,
	type CollapsibleContentOptions,
	type CollapsibleContentProps,
	type CollapsibleContentRenderProps,
	CollapsibleContent as Content,
} from "./collapsible-content";
import {
	type CollapsibleRootCommonProps,
	type CollapsibleRootOptions,
	type CollapsibleRootProps,
	type CollapsibleRootRenderProps,
	CollapsibleRoot as Root,
} from "./collapsible-root";
import {
	type CollapsibleTriggerCommonProps,
	type CollapsibleTriggerOptions,
	type CollapsibleTriggerProps,
	type CollapsibleTriggerRenderProps,
	CollapsibleTrigger as Trigger,
} from "./collapsible-trigger";

export type {
	CollapsibleContentOptions,
	CollapsibleContentCommonProps,
	CollapsibleContentRenderProps,
	CollapsibleContentProps,
	CollapsibleRootOptions,
	CollapsibleRootCommonProps,
	CollapsibleRootRenderProps,
	CollapsibleRootProps,
	CollapsibleTriggerOptions,
	CollapsibleTriggerCommonProps,
	CollapsibleTriggerRenderProps,
	CollapsibleTriggerProps,
};
export { Content, Root, Trigger };

export const Collapsible = Object.assign(Root, {
	Content,
	Trigger,
});

/**
 * API will most probably change
 */
export {
	useCollapsibleContext,
	type CollapsibleContextValue,
} from "./collapsible-context";
