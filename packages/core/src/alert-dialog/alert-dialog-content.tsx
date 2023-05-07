import { DialogContentProps } from "../dialog/index.jsx";
import { DialogContent } from "../dialog/dialog-content.jsx";

export interface AlertDialogContentProps extends DialogContentProps {}

/**
 * Overrides the regular `Dialog.Content` with role="alertdialog" to interrupt the user.
 */
export function AlertDialogContent(props: AlertDialogContentProps) {
  return <DialogContent role="alertdialog" {...props} />;
}
