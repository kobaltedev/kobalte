import {
	TabsContent as Content,
	type TabsContentCommonProps,
	type TabsContentOptions,
	type TabsContentProps,
	type TabsContentRenderProps,
} from "./tabs-content.tsx";
import {
	TabsIndicator as Indicator,
	type TabsIndicatorCommonProps,
	type TabsIndicatorOptions,
	type TabsIndicatorProps,
	type TabsIndicatorRenderProps,
} from "./tabs-indicator.tsx";
import {
	TabsList as List,
	type TabsListCommonProps,
	type TabsListOptions,
	type TabsListProps,
	type TabsListRenderProps,
} from "./tabs-list.tsx";
import {
	TabsRoot as Root,
	type TabsRootCommonProps,
	type TabsRootOptions,
	type TabsRootProps,
	type TabsRootRenderProps,
} from "./tabs-root.tsx";
import {
	type TabsTriggerCommonProps,
	type TabsTriggerOptions,
	type TabsTriggerProps,
	type TabsTriggerRenderProps,
	TabsTrigger as Trigger,
} from "./tabs-trigger.tsx";

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
 * API will most change
 */
export { type TabsContextValue, useTabsContext } from "./tabs-context.tsx";
