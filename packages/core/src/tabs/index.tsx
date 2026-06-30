import {
	TabsContent as Content,
	type TabsContentCommonProps,
	type TabsContentOptions,
	type TabsContentProps,
	type TabsContentRenderProps,
} from "./tabs-content";
import {
	TabsIndicator as Indicator,
	type TabsIndicatorCommonProps,
	type TabsIndicatorOptions,
	type TabsIndicatorProps,
	type TabsIndicatorRenderProps,
} from "./tabs-indicator";
import {
	TabsList as List,
	type TabsListCommonProps,
	type TabsListOptions,
	type TabsListProps,
	type TabsListRenderProps,
} from "./tabs-list";
import {
	TabsRoot as Root,
	type TabsRootCommonProps,
	type TabsRootOptions,
	type TabsRootProps,
	type TabsRootRenderProps,
} from "./tabs-root";
import {
	type TabsTriggerCommonProps,
	type TabsTriggerOptions,
	type TabsTriggerProps,
	type TabsTriggerRenderProps,
	TabsTrigger as Trigger,
} from "./tabs-trigger";

export type {
	TabsContentCommonProps,
	TabsContentOptions,
	TabsContentProps,
	TabsContentRenderProps,
	TabsIndicatorCommonProps,
	TabsIndicatorOptions,
	TabsIndicatorProps,
	TabsIndicatorRenderProps,
	TabsListCommonProps,
	TabsListOptions,
	TabsListProps,
	TabsListRenderProps,
	TabsRootCommonProps,
	TabsRootOptions,
	TabsRootProps,
	TabsRootRenderProps,
	TabsTriggerCommonProps,
	TabsTriggerOptions,
	TabsTriggerProps,
	TabsTriggerRenderProps,
};
export { Content, Indicator, List, Root, Trigger };

export const Tabs = Object.assign(Root, {
	Content,
	Indicator,
	List,
	Trigger,
});

/**
 * API will most probably change
 */
export { type TabsContextValue, useTabsContext } from "./tabs-context";
