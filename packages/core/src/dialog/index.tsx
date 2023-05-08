import {
  DialogCloseButton as CloseButton,
  type DialogCloseButtonProps,
} from "./dialog-close-button";
import {
  DialogContent as Content,
  type DialogContentOptions,
  type DialogContentProps,
} from "./dialog-content";
import {
  DialogDescription as Description,
  type DialogDescriptionProps,
} from "./dialog-description";
import {
  DialogOverlay as Overlay,
  type DialogOverlayOptions,
  type DialogOverlayProps,
} from "./dialog-overlay";
import { DialogPortal as Portal, type DialogPortalProps } from "./dialog-portal";
import { DialogRoot as Root, type DialogRootOptions, type DialogRootProps } from "./dialog-root";
import { DialogTitle as Title, type DialogTitleProps } from "./dialog-title";
import { DialogTrigger as Trigger, type DialogTriggerProps } from "./dialog-trigger";

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
