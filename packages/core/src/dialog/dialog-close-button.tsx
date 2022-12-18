import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { COMMON_INTL_MESSAGES, createLocalizedStringFormatter } from "../i18n";
import { PressEvents } from "../primitives";
import { useDialogContext } from "./dialog-context";

/**
 * The button that closes the dialog.
 */
export const DialogCloseButton = createPolymorphicComponent<"button", ButtonProps>(props => {
  const context = useDialogContext();

  const [local, others] = splitProps(props, ["onPress", "aria-label"]);

  const stringFormatter = createLocalizedStringFormatter(() => COMMON_INTL_MESSAGES);

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    context.close();
  };

  return (
    <Button
      aria-label={local["aria-label"] || stringFormatter().format("dismiss")}
      onPress={onPress}
      {...others}
    />
  );
});
