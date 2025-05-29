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
	DialogCloseButtonOptions,
	DialogCloseButtonCommonProps,
	DialogCloseButtonRenderProps,
	DialogCloseButtonProps,
	DialogContentOptions,
	DialogContentCommonProps,
	DialogContentRenderProps,
	DialogContentProps,
	DialogDescriptionCommonProps,
	DialogDescriptionOptions,
	DialogDescriptionRenderProps,
	DialogDescriptionProps,
	DialogOverlayOptions,
	DialogOverlayCommonProps,
	DialogOverlayRenderProps,
	DialogOverlayProps,
	DialogPortalProps,
	DialogRootOptions,
	DialogRootProps,
	DialogTitleCommonProps,
	DialogTitleOptions,
	DialogTitleRenderProps,
	DialogTitleProps,
	DialogTriggerCommonProps,
	DialogTriggerRenderProps,
	DialogTriggerOptions,
	DialogTriggerProps,
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
export { useDialogContext, type DialogContextValue } from "./dialog-context";
