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
	CollapsibleContentCommonProps,
	CollapsibleContentOptions,
	CollapsibleContentProps,
	CollapsibleContentRenderProps,
	CollapsibleRootCommonProps,
	CollapsibleRootOptions,
	CollapsibleRootProps,
	CollapsibleRootRenderProps,
	CollapsibleTriggerCommonProps,
	CollapsibleTriggerOptions,
	CollapsibleTriggerProps,
	CollapsibleTriggerRenderProps,
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
	type CollapsibleContextValue,
	useCollapsibleContext,
} from "./collapsible-context";
