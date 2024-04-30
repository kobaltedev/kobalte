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
	HoverCardPortal as Portal,
	type HoverCardPortalProps,
} from "./hover-card-portal";
import {
	HoverCardRoot as Root,
	type HoverCardRootOptions,
	type HoverCardRootProps,
} from "./hover-card-root";
import {
	HoverCardTrigger as Trigger,
	type HoverCardTriggerCommonProps,
	type HoverCardTriggerOptions,
	type HoverCardTriggerProps,
	type HoverCardTriggerRenderProps,
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
