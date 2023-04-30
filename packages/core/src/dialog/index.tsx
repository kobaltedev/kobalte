import {
  DialogCloseButton as CloseButton,
  type DialogCloseButtonProps,
} from "./dialog-close-button.js";
import {
  DialogContent as Content,
  type DialogContentOptions,
  type DialogContentProps,
} from "./dialog-content.js";
import {
  DialogDescription as Description,
  type DialogDescriptionProps,
} from "./dialog-description.js";
import {
  DialogOverlay as Overlay,
  type DialogOverlayOptions,
  type DialogOverlayProps,
} from "./dialog-overlay.js";
import { DialogPortal as Portal, type DialogPortalProps } from "./dialog-portal.js";
import { DialogRoot as Root, type DialogRootOptions, type DialogRootProps } from "./dialog-root.js";
import { DialogTitle as Title, type DialogTitleProps } from "./dialog-title.js";
import { DialogTrigger as Trigger, type DialogTriggerProps } from "./dialog-trigger.js";

export type {
  DialogCloseButtonProps,
  DialogContentOptions,
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayOptions,
  DialogOverlayProps,
  DialogPortalProps,
  DialogRootOptions,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
};

export { CloseButton, Content, Description, Overlay, Portal, Root, Title, Trigger };
