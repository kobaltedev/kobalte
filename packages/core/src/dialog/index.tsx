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
	DialogOverlay as Overlay,
	type DialogOverlayCommonProps,
	type DialogOverlayOptions,
	type DialogOverlayProps,
	type DialogOverlayRenderProps,
} from "./dialog-overlay";
import {
	DialogPortal as Portal,
	type DialogPortalProps,
} from "./dialog-portal";
import {
	DialogRoot as Root,
	type DialogRootOptions,
	type DialogRootProps,
} from "./dialog-root";
import {
	DialogTitle as Title,
	type DialogTitleCommonProps,
	type DialogTitleOptions,
	type DialogTitleProps,
	type DialogTitleRenderProps,
} from "./dialog-title";
import {
	DialogTrigger as Trigger,
	type DialogTriggerCommonProps,
	type DialogTriggerOptions,
	type DialogTriggerProps,
	type DialogTriggerRenderProps,
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
