import {
	StepsCompletedContent as CompletedContent,
	type StepsCompletedContentCommonProps,
	type StepsCompletedContentOptions,
	type StepsCompletedContentProps,
	type StepsCompletedContentRenderProps,
} from "./steps-completed-content";
import {
	StepsContent as Content,
	type StepsContentCommonProps,
	type StepsContentOptions,
	type StepsContentProps,
	type StepsContentRenderProps,
} from "./steps-content";
import {
	StepsIndicator as Indicator,
	type StepsIndicatorCommonProps,
	type StepsIndicatorOptions,
	type StepsIndicatorProps,
	type StepsIndicatorRenderProps,
} from "./steps-indicator";
import {
	StepsItem as Item,
	type StepsItemCommonProps,
	type StepsItemOptions,
	type StepsItemProps,
	type StepsItemRenderProps,
} from "./steps-item";
import {
	StepsList as List,
	type StepsListCommonProps,
	type StepsListOptions,
	type StepsListProps,
	type StepsListRenderProps,
} from "./steps-list";
import {
	StepsNextTrigger as NextTrigger,
	type StepsNextTriggerCommonProps,
	type StepsNextTriggerOptions,
	type StepsNextTriggerProps,
	type StepsNextTriggerRenderProps,
} from "./steps-next-trigger";
import {
	StepsPrevTrigger as PrevTrigger,
	type StepsPrevTriggerCommonProps,
	type StepsPrevTriggerOptions,
	type StepsPrevTriggerProps,
	type StepsPrevTriggerRenderProps,
} from "./steps-prev-trigger";
import {
	StepsProgress as Progress,
	type StepsProgressCommonProps,
	type StepsProgressOptions,
	type StepsProgressProps,
	type StepsProgressRenderProps,
} from "./steps-progress";
import {
	StepsRoot as Root,
	type StepsRootCommonProps,
	type StepsRootOptions,
	type StepsRootProps,
	type StepsRootRenderProps,
} from "./steps-root";
import {
	StepsSeparator as Separator,
	type StepsSeparatorCommonProps,
	type StepsSeparatorOptions,
	type StepsSeparatorProps,
	type StepsSeparatorRenderProps,
} from "./steps-separator";
import {
	type StepsTriggerCommonProps,
	type StepsTriggerOptions,
	type StepsTriggerProps,
	type StepsTriggerRenderProps,
	StepsTrigger as Trigger,
} from "./steps-trigger";

export type {
	StepsCompletedContentCommonProps,
	StepsCompletedContentOptions,
	StepsCompletedContentProps,
	StepsCompletedContentRenderProps,
	StepsContentCommonProps,
	StepsContentOptions,
	StepsContentProps,
	StepsContentRenderProps,
	StepsIndicatorCommonProps,
	StepsIndicatorOptions,
	StepsIndicatorProps,
	StepsIndicatorRenderProps,
	StepsItemCommonProps,
	StepsItemOptions,
	StepsItemProps,
	StepsItemRenderProps,
	StepsListCommonProps,
	StepsListOptions,
	StepsListProps,
	StepsListRenderProps,
	StepsNextTriggerCommonProps,
	StepsNextTriggerOptions,
	StepsNextTriggerProps,
	StepsNextTriggerRenderProps,
	StepsPrevTriggerCommonProps,
	StepsPrevTriggerOptions,
	StepsPrevTriggerProps,
	StepsPrevTriggerRenderProps,
	StepsProgressCommonProps,
	StepsProgressOptions,
	StepsProgressProps,
	StepsProgressRenderProps,
	StepsRootCommonProps,
	StepsRootOptions,
	StepsRootProps,
	StepsRootRenderProps,
	StepsSeparatorCommonProps,
	StepsSeparatorOptions,
	StepsSeparatorProps,
	StepsSeparatorRenderProps,
	StepsTriggerCommonProps,
	StepsTriggerOptions,
	StepsTriggerProps,
	StepsTriggerRenderProps,
};

export {
	CompletedContent,
	Content,
	Indicator,
	Item,
	List,
	NextTrigger,
	PrevTrigger,
	Progress,
	Root,
	Separator,
	Trigger,
};

export const Steps = Object.assign(Root, {
	CompletedContent,
	Content,
	Indicator,
	Item,
	List,
	NextTrigger,
	PrevTrigger,
	Progress,
	Separator,
	Trigger,
});

export {
	type StepState,
	type StepsContextValue,
	useStepsContext,
} from "./steps-context";
export {
	type StepsItemContextValue,
	useStepsItemContext,
} from "./steps-item-context";
