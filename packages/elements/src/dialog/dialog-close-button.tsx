import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { PressEvents } from "../primitives";
import { useDialogContext } from "./dialog-context";

/**
 * The button that closes the dialog.
 */
export const DialogCloseButton = createPolymorphicComponent<"button", ButtonProps>(props => {
  const context = useDialogContext();

  const [local, others] = splitProps(props, ["onPress"]);

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    context.close();
  };

  // TODO: i18n aria-label
  return <Button aria-label="Close" onPress={onPress} {...context.dataset()} {...others} />;
});
