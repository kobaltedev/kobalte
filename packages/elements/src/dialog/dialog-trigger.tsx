/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlayTrigger.ts
 */

import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { PressEvents } from "../primitives";
import { useDialogContext } from "./dialog-context";

/**
 * The button that opens the dialog.
 */
export const DialogTrigger = createPolymorphicComponent<"button", ButtonProps>(props => {
  const context = useDialogContext();

  const [local, others] = splitProps(props, ["onPress"]);

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    context.toggle();
  };

  return (
    <Button
      aria-haspopup="dialog"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.panelId() : undefined}
      onPress={onPress}
      {...context.dataset()}
      {...others}
    />
  );
});
