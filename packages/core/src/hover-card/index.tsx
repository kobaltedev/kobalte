import {
	Arrow,
	type PopperArrowCommonProps as HoverCardArrowCommonProps,
	type PopperArrowOptions as HoverCardArrowOptions,
	type PopperArrowProps as HoverCardArrowProps,
	type PopperArrowRenderProps as HoverCardArrowRenderProps,
} from "../popper/index.tsx";
import {
	HoverCardContent as Content,
	type HoverCardContentCommonProps,
	type HoverCardContentOptions,
	type HoverCardContentProps,
	type HoverCardContentRenderProps,
} from "./hover-card-content.tsx";
import {
	type HoverCardPortalProps,
	HoverCardPortal as Portal,
} from "./hover-card-portal.tsx";
import {
	type HoverCardRootOptions,
	type HoverCardRootProps,
	HoverCardRoot as Root,
} from "./hover-card-root.tsx";
import {
	type HoverCardTriggerCommonProps,
	type HoverCardTriggerOptions,
	type HoverCardTriggerProps,
	type HoverCardTriggerRenderProps,
	HoverCardTrigger as Trigger,
} from "./hover-card-trigger.tsx";

export type {
	HoverCardArrowCommonProps,
	HoverCardArrowOptions,
	HoverCardArrowProps,
	HoverCardArrowRenderProps,
	HoverCardContentCommonProps,
	HoverCardContentOptions,
	HoverCardContentProps,
	HoverCardContentRenderProps,
	HoverCardPortalProps,
	HoverCardRootOptions,
	HoverCardRootProps,
	HoverCardTriggerCommonProps,
	HoverCardTriggerOptions,
	HoverCardTriggerProps,
	HoverCardTriggerRenderProps,
};

export { Arrow, Content, Portal, Root, Trigger };

export const HoverCard = Object.assign(Root, {
	Arrow,
	Content,
	Portal,
	Trigger,
});

/**
 * API will most probably change
 */
export {
	type HoverCardContextValue,
	useHoverCardContext,
} from "./hover-card-context.tsx";
