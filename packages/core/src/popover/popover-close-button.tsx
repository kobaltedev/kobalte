import { createPolymorphicComponent } from "@kobalte/utils";
import { splitProps } from "solid-js";

import * as Button from "../button";
import { COMMON_INTL_MESSAGES, createLocalizedStringFormatter } from "../i18n";
import { PressEvents } from "../primitives";
import { usePopoverContext } from "./popover-context";

/**
 * The button that closes the popover.
 */
export const PopoverCloseButton = /*#__PURE__*/ createPolymorphicComponent<
  "button",
  Button.ButtonRootOptions
>(props => {
  const context = usePopoverContext();

  const [local, others] = splitProps(props, ["onPress", "aria-label"]);

  const stringFormatter = createLocalizedStringFormatter(() => COMMON_INTL_MESSAGES);

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    context.close();
  };

  return (
    <Button.Root
      aria-label={local["aria-label"] || stringFormatter().format("dismiss")}
      onPress={onPress}
      {...others}
    />
  );
});
