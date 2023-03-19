import { DialogContentProps } from "../dialog";
import { DialogContent } from "../dialog/dialog-content";

export interface AlertDialogContentProps extends DialogContentProps {}

/*
 *Overrides the regular Dialog with role="alertdialog" to interrupt the user
 */
export function AlertDialogContent(props: AlertDialogContentProps) {
  return <DialogContent role="alertdialog" {...props} />;
}
