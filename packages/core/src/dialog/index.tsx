import {
	DialogCloseButton as CloseButton,
	type DialogCloseButtonCommonProps,
	type DialogCloseButtonOptions,
	type DialogCloseButtonProps,
	type DialogCloseButtonRenderProps,
} from "./dialog-close-button";
import {
	DialogContent as Content,
	type DialogContentCommonProps,
	type DialogContentOptions,
	type DialogContentProps,
	type DialogContentRenderProps,
} from "./dialog-content";
import {
	DialogDescription as Description,
	type DialogDescriptionCommonProps,
	type DialogDescriptionOptions,
	type DialogDescriptionProps,
	type DialogDescriptionRenderProps,
} from "./dialog-description";
import {
	type DialogOverlayCommonProps,
	type DialogOverlayOptions,
	type DialogOverlayProps,
	type DialogOverlayRenderProps,
	DialogOverlay as Overlay,
} from "./dialog-overlay";
import {
	type DialogPortalProps,
	DialogPortal as Portal,
} from "./dialog-portal";
import {
	type DialogRootOptions,
	type DialogRootProps,
	DialogRoot as Root,
} from "./dialog-root";
import {
	type DialogTitleCommonProps,
	type DialogTitleOptions,
	type DialogTitleProps,
	type DialogTitleRenderProps,
	DialogTitle as Title,
} from "./dialog-title";
import {
	type DialogTriggerCommonProps,
	type DialogTriggerOptions,
	type DialogTriggerProps,
	type DialogTriggerRenderProps,
	DialogTrigger as Trigger,
} from "./dialog-trigger";

export type {
	DialogCloseButtonCommonProps,
	DialogCloseButtonOptions,
	DialogCloseButtonProps,
	DialogCloseButtonRenderProps,
	DialogContentCommonProps,
	DialogContentOptions,
	DialogContentProps,
	DialogContentRenderProps,
	DialogDescriptionCommonProps,
	DialogDescriptionOptions,
	DialogDescriptionProps,
	DialogDescriptionRenderProps,
	DialogOverlayCommonProps,
	DialogOverlayOptions,
	DialogOverlayProps,
	DialogOverlayRenderProps,
	DialogPortalProps,
	DialogRootOptions,
	DialogRootProps,
	DialogTitleCommonProps,
	DialogTitleOptions,
	DialogTitleProps,
	DialogTitleRenderProps,
	DialogTriggerCommonProps,
	DialogTriggerOptions,
	DialogTriggerProps,
	DialogTriggerRenderProps,
};

export {
	CloseButton,
	Content,
	Description,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
};

export const Dialog = Object.assign(Root, {
	CloseButton,
	Content,
	Description,
	Overlay,
	Portal,
	Title,
	Trigger,
});

/**
 * API will most probably change
 */
export { type DialogContextValue, useDialogContext } from "./dialog-context";
