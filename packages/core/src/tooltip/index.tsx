import {
	Arrow,
	type PopperArrowCommonProps as TooltipArrowCommonProps,
	type PopperArrowOptions as TooltipArrowOptions,
	type PopperArrowProps as TooltipArrowProps,
	type PopperArrowRenderProps as TooltipArrowRenderProps,
} from "../popper";
import {
	TooltipContent as Content,
	type TooltipContentCommonProps,
	type TooltipContentOptions,
	type TooltipContentProps,
	type TooltipContentRenderProps,
} from "./tooltip-content";
import {
	TooltipPortal as Portal,
	type TooltipPortalProps,
} from "./tooltip-portal";
import {
	TooltipRoot as Root,
	type TooltipRootOptions,
	type TooltipRootProps,
} from "./tooltip-root";
import {
	type TooltipTriggerCommonProps,
	type TooltipTriggerOptions,
	type TooltipTriggerProps,
	type TooltipTriggerRenderProps,
	TooltipTrigger as Trigger,
} from "./tooltip-trigger";

export type {
	TooltipArrowCommonProps,
	TooltipArrowOptions,
	TooltipArrowProps,
	TooltipArrowRenderProps,
	TooltipContentCommonProps,
	TooltipContentOptions,
	TooltipContentProps,
	TooltipContentRenderProps,
	TooltipPortalProps,
	TooltipRootOptions,
	TooltipRootProps,
	TooltipTriggerCommonProps,
	TooltipTriggerOptions,
	TooltipTriggerProps,
	TooltipTriggerRenderProps,
};

export { Arrow, Content, Portal, Root, Trigger };

export const Tooltip = Object.assign(Root, {
	Arrow,
	Content,
	Portal,
	Trigger,
});

/**
 * API will most probably change
 */
export { type TooltipContextValue, useTooltipContext } from "./tooltip-context";
