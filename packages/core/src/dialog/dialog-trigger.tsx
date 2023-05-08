/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlayTrigger.ts
 */

import { callHandler, mergeRefs, OverrideComponentProps } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { useDialogContext } from "./dialog-context";

export interface DialogTriggerProps
  extends OverrideComponentProps<"button", Button.ButtonRootOptions> {}

/**
 * The button that opens the dialog.
 */
export function DialogTrigger(props: DialogTriggerProps) {
  const context = useDialogContext();

  const [local, others] = splitProps(props, ["ref", "onClick"]);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);
    context.toggle();
  };

  return (
    <Button.Root
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      aria-haspopup="dialog"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      data-expanded={context.isOpen() ? "" : undefined}
      data-closed={!context.isOpen() ? "" : undefined}
      onClick={onClick}
      {...others}
    />
  );
}
