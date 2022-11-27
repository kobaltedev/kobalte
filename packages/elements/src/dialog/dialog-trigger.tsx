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
