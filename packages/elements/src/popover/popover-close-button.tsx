import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { Button, ButtonProps } from "../button";
import { PressEvents } from "../primitives";
import { usePopoverContext } from "./popover-context";

/**
 * The button that closes the popover.
 */
export const PopoverCloseButton = createPolymorphicComponent<"button", ButtonProps>(props => {
  const context = usePopoverContext();

  const [local, others] = splitProps(props, ["onPress"]);

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    context.close();
  };

  // TODO: i18n aria-label
  return <Button aria-label="Close" onPress={onPress} {...context.dataset()} {...others} />;
});
