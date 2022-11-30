/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/810579b671791f1593108f62cdc1893de3a220e3/packages/@react-aria/overlays/src/useOverlayTrigger.ts
 */

import { createPolymorphicComponent, mergeRefs } from "@kobalte/utils";
import { splitProps } from "solid-js";

import { DialogTrigger, DialogTriggerProps } from "../dialog/dialog-trigger";
import { usePopoverContext } from "./popover-context";

/**
 * The button that opens the popover.
 */
export const PopoverTrigger = createPolymorphicComponent<"button", DialogTriggerProps>(props => {
  const context = usePopoverContext();

  const [local, others] = splitProps(props, ["ref"]);

  return <DialogTrigger ref={mergeRefs(context.setTriggerRef, local.ref)} {...others} />;
});
