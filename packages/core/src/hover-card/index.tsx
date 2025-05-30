import {
	Arrow,
	type PopperArrowCommonProps as HoverCardArrowCommonProps,
	type PopperArrowOptions as HoverCardArrowOptions,
	type PopperArrowProps as HoverCardArrowProps,
	type PopperArrowRenderProps as HoverCardArrowRenderProps,
} from "../popper";
import {
	HoverCardContent as Content,
	type HoverCardContentCommonProps,
	type HoverCardContentOptions,
	type HoverCardContentProps,
	type HoverCardContentRenderProps,
} from "./hover-card-content";
import {
	type HoverCardPortalProps,
	HoverCardPortal as Portal,
} from "./hover-card-portal";
import {
	type HoverCardRootOptions,
	type HoverCardRootProps,
	HoverCardRoot as Root,
} from "./hover-card-root";
import {
	type HoverCardTriggerCommonProps,
	type HoverCardTriggerOptions,
	type HoverCardTriggerProps,
	type HoverCardTriggerRenderProps,
	HoverCardTrigger as Trigger,
} from "./hover-card-trigger";

export type {
	HoverCardArrowOptions,
	HoverCardArrowCommonProps,
	HoverCardArrowRenderProps,
	HoverCardArrowProps,
	HoverCardContentOptions,
	HoverCardContentCommonProps,
	HoverCardContentRenderProps,
	HoverCardContentProps,
	HoverCardPortalProps,
	HoverCardRootOptions,
	HoverCardRootProps,
	HoverCardTriggerOptions,
	HoverCardTriggerCommonProps,
	HoverCardTriggerRenderProps,
	HoverCardTriggerProps,
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
	useHoverCardContext,
	type HoverCardContextValue,
} from "./hover-card-context";
