import { callHandler, createPolymorphicComponent } from "@kobalte/utils";
import { JSX, splitProps } from "solid-js";

import { FormControlLabel } from "../form-control";
import { setInteractionModality } from "../primitives";
import { useSelectContext } from "./select-context";

/**
 * The label that gives the user information on the select.
 */
export const SelectLabel = /*#__PURE__*/ createPolymorphicComponent<"span">(props => {
  const context = useSelectContext();

  const [local, others] = splitProps(props, ["onClick"]);

  const onClick: JSX.EventHandlerUnion<any, MouseEvent> = e => {
    callHandler(e, local.onClick);

    if (!context.isDisabled()) {
      context.triggerRef()?.focus();

      // Show the focus ring so the user knows where focus went
      setInteractionModality("keyboard");
    }
  };

  return <FormControlLabel as="span" onClick={onClick} {...others} />;
});
