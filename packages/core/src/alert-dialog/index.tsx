import {
  CloseButton,
  Description,
  type DialogCloseButtonProps as AlertDialogCloseButtonProps,
  type DialogContentOptions as AlertDialogContentOptions,
  type DialogDescriptionProps as AlertDialogDescriptionProps,
  type DialogOverlayOptions as AlertDialogOverlayOptions,
  type DialogOverlayProps as AlertDialogOverlayProps,
  type DialogPortalProps as AlertDialogPortalProps,
  type DialogRootOptions as AlertDialogRootOptions,
  type DialogRootProps as AlertDialogRootProps,
  type DialogTitleProps as AlertDialogTitleProps,
  type DialogTriggerProps as AlertDialogTriggerProps,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "../dialog";
import { AlertDialogContent as Content, AlertDialogContentProps } from "./alert-dialog-content";

export type {
  AlertDialogCloseButtonProps,
  AlertDialogContentOptions,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogOverlayOptions,
  AlertDialogOverlayProps,
  AlertDialogPortalProps,
  AlertDialogRootOptions,
  AlertDialogRootProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
};

export { CloseButton, Content, Description, Overlay, Portal, Root, Title, Trigger };
