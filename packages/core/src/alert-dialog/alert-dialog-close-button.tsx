import { callHandler, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { COMMON_INTL_MESSAGES, createLocalizedStringFormatter } from "../i18n";
import { useAlertDialogContext } from "./alert-dialog-context";

export interface AlertDialogCloseButtonProps
  extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

/**
 * The button that closes the alert dialog.
 */
export function AlertDialogCloseButton(props: AlertDialogCloseButtonProps) {
  const context = useAlertDialogContext();

  const [local, others] = splitProps(props, ["aria-label", "onClick"]);

  const stringFormatter = createLocalizedStringFormatter(() => COMMON_INTL_MESSAGES);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);
    context.close();
  };

  return (
    <Button.Root
      aria-label={local["aria-label"] || stringFormatter().format("dismiss")}
      onClick={onClick}
      {...others}
    />
  );
}
