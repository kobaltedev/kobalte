import { callHandler, createPolymorphicComponent } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import * as Button from "../button";
import { COMMON_INTL_MESSAGES, createLocalizedStringFormatter } from "../i18n";
import { usePopoverContext } from "./popover-context";

/**
 * The button that closes the popover.
 */
export const PopoverCloseButton = createPolymorphicComponent<"button", Button.ButtonRootOptions>(
  props => {
    const context = usePopoverContext();

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
);
