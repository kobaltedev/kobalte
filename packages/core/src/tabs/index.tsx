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
	TabsContentOptions,
	TabsContentCommonProps,
	TabsContentRenderProps,
	TabsContentProps,
	TabsIndicatorOptions,
	TabsIndicatorCommonProps,
	TabsIndicatorRenderProps,
	TabsIndicatorProps,
	TabsListOptions,
	TabsListCommonProps,
	TabsListRenderProps,
	TabsListProps,
	TabsRootOptions,
	TabsRootCommonProps,
	TabsRootRenderProps,
	TabsRootProps,
	TabsTriggerOptions,
	TabsTriggerCommonProps,
	TabsTriggerRenderProps,
	TabsTriggerProps,
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
export { useTabsContext, type TabsContextValue } from "./tabs-context";
