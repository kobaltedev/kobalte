/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlayTrigger.ts
 */

import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";

import * as Button from "../button";
import { PressEvents } from "../primitives";
import { usePopoverContext } from "./popover-context";

/**
 * The button that opens the popover.
 */
export const PopoverTrigger = /*#__PURE__*/ createPolymorphicComponent<
  "button",
  Button.ButtonRootOptions
>(props => {
  const context = usePopoverContext();

  const [local, others] = splitProps(props, ["ref", "onPress"]);

  const onPress: PressEvents["onPress"] = e => {
    local.onPress?.(e);
    context.toggle();
  };

  return (
    <Button.Root
      ref={mergeRefs(context.setTriggerRef, local.ref)}
      aria-haspopup="dialog"
      aria-expanded={context.isOpen()}
      aria-controls={context.isOpen() ? context.contentId() : undefined}
      data-expanded={context.isOpen() ? "" : undefined}
      onPress={onPress}
      {...others}
    />
  );
});
