import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { createLocalizedStringFormatter } from "../i18n";
import { PressEvents } from "../primitives";
import { POPOVER_INTL_MESSAGES } from "./popover.intl";
import { usePopoverContext } from "./popover-context";

/**
 * The button that closes the popover.
 */
export const PopoverCloseButton = createPolymorphicComponent<"button", ButtonProps>(props => {
  const context = usePopoverContext();

  const [local, others] = splitProps(props, ["onPress", "aria-label"]);

  const stringFormatter = createLocalizedStringFormatter(() => POPOVER_INTL_MESSAGES);

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
