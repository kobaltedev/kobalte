import {
	Arrow,
	type PopperArrowCommonProps as PopoverArrowCommonProps,
	type PopperArrowOptions as PopoverArrowOptions,
	type PopperArrowProps as PopoverArrowProps,
	type PopperArrowRenderProps as PopoverArrowRenderProps,
} from "../popper";
import {
	PopoverAnchor as Anchor,
	type PopoverAnchorCommonProps,
	type PopoverAnchorOptions,
	type PopoverAnchorProps,
	type PopoverAnchorRenderProps,
} from "./popover-anchor";
import {
	PopoverCloseButton as CloseButton,
	type PopoverCloseButtonCommonProps,
	type PopoverCloseButtonOptions,
	type PopoverCloseButtonProps,
	type PopoverCloseButtonRenderProps,
} from "./popover-close-button";
import {
	PopoverContent as Content,
	type PopoverContentCommonProps,
	type PopoverContentOptions,
	type PopoverContentProps,
	type PopoverContentRenderProps,
} from "./popover-content";
import {
	PopoverDescription as Description,
	type PopoverDescriptionCommonProps,
	type PopoverDescriptionOptions,
	type PopoverDescriptionProps,
	type PopoverDescriptionRenderProps,
} from "./popover-description";
import {
	type PopoverPortalProps,
	PopoverPortal as Portal,
} from "./popover-portal";
import {
	type PopoverRootOptions,
	type PopoverRootProps,
	PopoverRoot as Root,
} from "./popover-root";
import {
	type PopoverTitleCommonProps,
	type PopoverTitleOptions,
	type PopoverTitleProps,
	type PopoverTitleRenderProps,
	PopoverTitle as Title,
} from "./popover-title";
import {
	type PopoverTriggerCommonProps,
	type PopoverTriggerOptions,
	type PopoverTriggerProps,
	type PopoverTriggerRenderProps,
	PopoverTrigger as Trigger,
} from "./popover-trigger";

export type {
	PopoverAnchorOptions,
	PopoverAnchorCommonProps,
	PopoverAnchorRenderProps,
	PopoverAnchorProps,
	PopoverArrowOptions,
	PopoverArrowCommonProps,
	PopoverArrowRenderProps,
	PopoverArrowProps,
	PopoverCloseButtonOptions,
	PopoverCloseButtonCommonProps,
	PopoverCloseButtonRenderProps,
	PopoverCloseButtonProps,
	PopoverContentOptions,
	PopoverContentCommonProps,
	PopoverContentRenderProps,
	PopoverContentProps,
	PopoverDescriptionOptions,
	PopoverDescriptionCommonProps,
	PopoverDescriptionRenderProps,
	PopoverDescriptionProps,
	PopoverPortalProps,
	PopoverRootOptions,
	PopoverRootProps,
	PopoverTitleOptions,
	PopoverTitleCommonProps,
	PopoverTitleRenderProps,
	PopoverTitleProps,
	PopoverTriggerOptions,
	PopoverTriggerCommonProps,
	PopoverTriggerRenderProps,
	PopoverTriggerProps,
};

export {
	Anchor,
	Arrow,
	CloseButton,
	Content,
	Description,
	Portal,
	Root,
	Title,
	Trigger,
};

export const Popover = Object.assign(Root, {
	Anchor,
	Arrow,
	CloseButton,
	Content,
	Description,
	Portal,
	Title,
	Trigger,
});

/**
 * API will most probably change
 */
export { usePopoverContext, type PopoverContextValue } from "./popover-context";
