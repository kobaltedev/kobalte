import {
  AlertDialogCloseButton as CloseButton,
  type AlertDialogCloseButtonProps,
} from "./alert-dialog-close-button";
import {
  AlertDialogContent as Content,
  type AlertDialogContentOptions,
  type AlertDialogContentProps,
} from "./alert-dialog-content";
import {
  AlertDialogDescription as Description,
  type AlertDialogDescriptionProps,
} from "./alert-dialog-description";
import {
  AlertDialogOverlay as Overlay,
  type AlertDialogOverlayOptions,
  type AlertDialogOverlayProps,
} from "./alert-dialog-overlay";
import { AlertDialogPortal as Portal, type AlertDialogPortalProps } from "./alert-dialog-portal";
import {
  AlertDialogRoot as Root,
  type AlertDialogRootOptions,
  type AlertDialogRootProps,
} from "./alert-dialog-root";
import { AlertDialogTitle as Title, type AlertDialogTitleProps } from "./alert-dialog-title";
import {
  AlertDialogTrigger as Trigger,
  type AlertDialogTriggerProps,
} from "./alert-dialog-trigger";

export type {
  AlertDialogPortalProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
  AlertDialogCloseButtonProps as DialogCloseButtonProps,
  AlertDialogContentOptions as DialogContentOptions,
  AlertDialogContentProps as DialogContentProps,
  AlertDialogDescriptionProps as DialogDescriptionProps,
  AlertDialogOverlayOptions as DialogOverlayOptions,
  AlertDialogOverlayProps as DialogOverlayProps,
  AlertDialogRootOptions as DialogRootOptions,
  AlertDialogRootProps as DialogRootProps,
};

export { CloseButton, Content, Description, Overlay, Portal, Root, Title, Trigger };
